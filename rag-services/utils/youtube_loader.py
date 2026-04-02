from youtube_transcipt_api import YoutubeTransciptAPI
from langchain.schema import Document
from uilts.text_splitter import split_documents
import re

def extract_video_id(url:str):
    pattern="(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match=re.search(pattern,url)
    return match.group(1) if match else None

def loa_youtube(url:str,collection_id:str):
    video_id=extract_video_id(url)
    if not video_id:
        raise ValueError("Invalid YouTube URL")

    transcript=YouTubeTranscripts(video_id)
    full_text=" ".join([entry["text"] for entry in transcript])
    doc=Document(
        page_content=full_text,
        metadata={
            "source":url,
            "collection_id":collection_id,
            "type":"youtube",
            "video_id":video_id
        }
    )
    chunks=split_documents(doc)
    return chunks
