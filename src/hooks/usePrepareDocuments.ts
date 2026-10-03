import { meetings } from "../meetings";
import { PREPARE_BATCH_KEY, usePrepareDocumentsMutation } from "../app/documentsApi";
import { useEffect, useRef } from "react";

const ids = meetings.map((meet) => meet.documentId).filter((id) => id !== undefined);

export default function usePrepareDocuments() {
    const sentRef = useRef(false);
    const [prepareDocuments] = usePrepareDocumentsMutation({
        fixedCacheKey: PREPARE_BATCH_KEY,
    });

    useEffect(() => {
        if (ids.length > 0 && !sentRef.current) {
            sentRef.current = true;
            prepareDocuments(ids);
        }
    }, [prepareDocuments]);
}
