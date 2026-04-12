from youtube_transcript_api import YouTubeTranscriptApi
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
    """Fetch transcript using the modern instance-based API (v1.0+)."""
    ytt_api = YouTubeTranscriptApi()

    # Try preferred languages first
    for lang in ["en", "en-US", "en-GB", "hi"]:
        try:
            transcript = ytt_api.fetch(video_id, languages=[lang])
            return transcript.to_raw_data()
        except Exception as e:
            print(f"[youtube] lang {lang} failed: {e}")
            continue

    # Fallback: list all available transcripts and pick the first one
    try:
        transcript_list = ytt_api.list(video_id)
        for t in transcript_list:
            try:
                transcript = ytt_api.fetch(video_id, languages=[t.language_code])
                return transcript.to_raw_data()
            except Exception as e:
                print(f"[youtube] fallback failed for {t.language_code}: {e}")
                continue
    except Exception as e:
        raise RuntimeError(f"All transcript fetch strategies failed: {e}")

    raise RuntimeError("No transcript could be fetched.")


def load_youtube(url: str, collection_id: str):
    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError(f"Could not extract video ID from URL: {url}")

    print(f"[youtube_loader] video_id={video_id}")

    try:
        transcript = fetch_transcript(video_id)
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