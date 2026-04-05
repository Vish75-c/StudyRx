from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)
from langchain_core.documents import Document
from utils.text_splitter import split_documents
from urllib.parse import urlparse, parse_qs
import re


def extract_video_id(url: str):
    parsed = urlparse(url)
    query = parse_qs(parsed.query)

    if "v" in query:
        return query["v"][0]

    patterns = [
        r"youtu\.be/([0-9A-Za-z_-]{11})",
        r"/shorts/([0-9A-Za-z_-]{11})",
        r"/embed/([0-9A-Za-z_-]{11})",
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None


def fetch_transcript(video_id: str) -> list:
    """
    v1.2.4 uses instance-based API: YouTubeTranscriptApi()
    Tries multiple language fallbacks.
    """
    api = YouTubeTranscriptApi()

    # Strategy 1: list transcripts and pick best
    try:
        transcript_list = api.list(video_id)

        preferred = ["en", "en-US", "en-GB", "hi"]

        # Try preferred languages
        try:
            t = transcript_list.find_transcript(preferred)
            fetched = t.fetch()
            return [{"text": s.text, "start": s.start, "duration": s.duration} for s in fetched]
        except Exception:
            pass

        # Any manual transcript
        for t in transcript_list:
            if not t.is_generated:
                try:
                    fetched = t.fetch()
                    return [{"text": s.text, "start": s.start, "duration": s.duration} for s in fetched]
                except Exception:
                    continue

        # Any auto-generated transcript
        for t in transcript_list:
            if t.is_generated:
                try:
                    fetched = t.fetch()
                    return [{"text": s.text, "start": s.start, "duration": s.duration} for s in fetched]
                except Exception:
                    continue

        # Absolute fallback
        for t in transcript_list:
            try:
                fetched = t.fetch()
                return [{"text": s.text, "start": s.start, "duration": s.duration} for s in fetched]
            except Exception:
                continue

    except Exception as list_err:
        print(f"[youtube_loader] list() failed: {list_err}")

    # Strategy 2: direct fetch with language fallback
    preferred_langs = ["en", "en-US", "en-GB", "hi"]
    for lang in preferred_langs:
        try:
            fetched = api.fetch(video_id, languages=[lang])
            return [{"text": s.text, "start": s.start, "duration": s.duration} for s in fetched]
        except Exception:
            continue

    # Strategy 3: fetch with no language preference
    try:
        fetched = api.fetch(video_id)
        # v1.2.4 returns FetchedTranscript object — iterate its snippets
        result = []
        for s in fetched:
            if hasattr(s, "text"):
                result.append({"text": s.text, "start": s.start, "duration": s.duration})
            elif isinstance(s, dict):
                result.append(s)
        return result
    except Exception as e:
        raise RuntimeError(f"All transcript fetch strategies failed: {e}")


def load_youtube(url: str, collection_id: str):
    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError(f"Could not extract video ID from URL: {url}")

    print(f"[youtube_loader] video_id={video_id}")

    try:
        transcript = fetch_transcript(video_id)
    except TranscriptsDisabled:
        raise ValueError("Transcripts are disabled for this video.")
    except VideoUnavailable:
        raise ValueError("This video is unavailable or private.")
    except NoTranscriptFound:
        raise ValueError(
            "No transcript found for this video in any language. "
            "The video may not have captions enabled."
        )
    except Exception as e:
        raise RuntimeError(f"YouTube transcript error: {e}")

    if not transcript:
        raise ValueError("Transcript was fetched but is empty.")

    full_text = " ".join(
        entry["text"] if isinstance(entry, dict) else entry.text
        for entry in transcript
    )

    doc = Document(
        page_content=full_text,
        metadata={
            "source": url,
            "collection_id": collection_id,
            "type": "youtube",
            "video_id": video_id,
        },
    )

    return split_documents([doc])