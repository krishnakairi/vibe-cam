import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";


function QRLink(connectionId: any) {
    const url = `${window.location.host}/track/${connectionId}`
    return <QRCode value={url} />
}

export default QRLink;