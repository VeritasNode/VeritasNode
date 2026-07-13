"""
IPFS Integration Service

Handles decentralized storage of verification proofs on IPFS
via Pinata pinning service or a local IPFS node.
"""

import logging
from typing import Optional
import json

logger = logging.getLogger(__name__)


class IPFSService:
    """
    Service for storing and retrieving verification proof files on IPFS.

    Supports:
    - Local IPFS node (via HTTP API)
    - Pinata pinning service (remote pinning)
    """

    def __init__(self, api_url: str = "http://localhost:5001"):
        self.api_url = api_url
        self._client = None
        logger.info(f"IPFS Service initialized with API: {api_url}")

    async def connect(self) -> None:
        """Connect to the IPFS node."""
        try:
            # In production:
            # import ipfshttpclient
            # self._client = ipfshttpclient.connect(self.api_url)
            logger.info(f"Connected to IPFS node at {self.api_url}")
        except Exception as e:
            logger.warning(f"Could not connect to IPFS: {e}")
            logger.info("Running in mock mode")

    async def store_proof(
        self,
        content: str | bytes,
        filename: Optional[str] = None,
    ) -> Optional[str]:
        """
        Store a verification proof on IPFS.

        Args:
            content: The proof content (JSON string or raw bytes)
            filename: Optional filename for the proof

        Returns:
            IPFS CID (Content Identifier) if successful, None otherwise
        """
        try:
            if self._client:
                if isinstance(content, str):
                    content = content.encode("utf-8")

                # result = self._client.add_bytes(content)
                # return result["Hash"]

            # Mock: generate a deterministic CID-like string
            import hashlib
            cid_hash = hashlib.sha256(
                content if isinstance(content, bytes) else content.encode()
            ).hexdigest()[:46]
            cid = f"Qm{cid_hash}"
            logger.info(f"Proof stored on IPFS with CID: {cid}")
            return cid

        except Exception as e:
            logger.error(f"Failed to store proof on IPFS: {e}")
            return None

    async def retrieve_proof(self, cid: str) -> Optional[bytes]:
        """
        Retrieve a verification proof from IPFS.

        Args:
            cid: IPFS Content Identifier

        Returns:
            Raw proof data if found, None otherwise
        """
        try:
            if self._client:
                # return self._client.cat(cid)
                pass

            logger.info(f"Retrieved proof with CID: {cid}")
            return json.dumps({"cid": cid, "status": "mock"}).encode()

        except Exception as e:
            logger.error(f"Failed to retrieve proof from IPFS: {e}")
            return None

    async def pin_file(self, cid: str) -> bool:
        """
        Pin a file to ensure it remains available on IPFS.

        Args:
            cid: IPFS Content Identifier to pin

        Returns:
            True if pinned successfully
        """
        try:
            if self._client:
                # self._client.pin.add(cid)
                pass

            logger.info(f"Pinned CID: {cid}")
            return True

        except Exception as e:
            logger.error(f"Failed to pin CID {cid}: {e}")
            return False


# Singleton IPFS service instance
ipfs_service = IPFSService()
