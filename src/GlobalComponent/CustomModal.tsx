import * as React from "react";

const CustomModal = ({ title, icon = "ℹ️", message, note, buttonOneText, buttonTwoText, onButtonOneClick, onButtonTwoClick, }: any) => {
    if(icon == "ℹ️"){
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="65" viewBox="0 0 64 65" fill="none">
<g clip-path="url(#clip0_3949_32975)">
    <path d="M32 64.5C25.671 64.5 19.4841 62.6232 14.2218 59.107C8.95939 55.5908 4.85787 50.5931 2.43587 44.7459C0.0138652 38.8987 -0.619842 32.4645 0.614885 26.2571C1.84961 20.0497 4.89732 14.3479 9.3726 9.8726C13.8479 5.39732 19.5497 2.34961 25.7571 1.11489C31.9645 -0.119842 38.3987 0.513865 44.2459 2.93587C50.0931 5.35787 55.0908 9.45939 58.607 14.7218C62.1232 19.9841 64 26.171 64 32.5C63.9908 40.9841 60.6165 49.1181 54.6173 55.1173C48.6181 61.1165 40.4841 64.4908 32 64.5ZM32 5.83335C26.7258 5.83335 21.5701 7.39732 17.1848 10.3275C12.7995 13.2577 9.38156 17.4224 7.36323 22.2951C5.34489 27.1678 4.8168 32.5296 5.84574 37.7024C6.87468 42.8753 9.41443 47.6268 13.1438 51.3562C16.8732 55.0856 21.6248 57.6254 26.7976 58.6543C31.9704 59.6832 37.3322 59.1551 42.2049 57.1368C47.0776 55.1185 51.2424 51.7005 54.1725 47.3152C57.1027 42.9299 58.6667 37.7742 58.6667 32.5C58.6589 25.43 55.8469 18.6517 50.8476 13.6524C45.8483 8.65312 39.0701 5.84111 32 5.83335Z" fill="#0C78BE" />
    <path d="M37.3329 51.1675H31.9996V32.5008H26.6663V27.1675H31.9996C33.4141 27.1675 34.7706 27.7294 35.7708 28.7296C36.771 29.7298 37.3329 31.0863 37.3329 32.5008V51.1675Z" fill="#0C78BE" />
    <path d="M32 21.8325C34.2092 21.8325 36 20.0417 36 17.8325C36 15.6234 34.2092 13.8325 32 13.8325C29.7909 13.8325 28 15.6234 28 17.8325C28 20.0417 29.7909 21.8325 32 21.8325Z" fill="#0C78BE" />
</g>
<defs>
    <clipPath id="clip0_3949_32975">
        <rect width="64" height="64" fill="white" transform="translate(0 0.5)" />
    </clipPath>
</defs>
</svg>`
    }
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div className="modalSection">
                <div className="modalIconSection" dangerouslySetInnerHTML={{ __html: icon }}>

                </div>
                <div className="modalContentBody">
                    <div className="modalContentTitle">
                        {title}
                    </div>
                    <div className="modalContentData">{message}
                        <br />
                        {note && (
                            // Ensure `note` is a string or renderable element
                            <span>{typeof note === "object" ? JSON.stringify(note) : note}</span>
                        )} </div>
                </div>
                <div className="modalScetionFooter">
                    {buttonOneText && (
                        <button className="btn btn-default"
                            onClick={onButtonOneClick}>
                            {buttonOneText}
                        </button>
                    )}
                    {buttonTwoText && (
                        <button className="btn btn-primary" onClick={onButtonTwoClick}>
                            {buttonTwoText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
