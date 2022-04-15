import { HeartFilled } from "@ant-design/icons/lib/icons";
import preval from "preval.macro";
import { useEffect, useRef, useState } from "react";
import { COLOR } from "../constants/colors";
import LOGO from "../img/logo.png";

export default function MainLayout({ children }) {
    const headerRef = useRef();
    const footerRef = useRef();
    const [contentMinHeight, setContentMinHeight] = useState("50%");

    useEffect(() => {
        if (headerRef.current && footerRef.current) {
            const minHeight =
                "calc(100vH - " +
                headerRef.current.clientHeight +
                "px - " +
                footerRef.current.clientHeight +
                "px)";
            setContentMinHeight(minHeight);
        }
    }, []);
    return (
        <>
            <header
                ref={headerRef}
                style={{
                    backgroundColor: COLOR.BLACK,
                    position: "fixed",
                    top: 0,
                    right: 0,
                    left: 0,
                    zIndex: 50,
                    boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        marginRight: "auto",
                        marginLeft: "auto",
                        maxWidth: "85%",
                    }}
                >
                    <a
                        href="/"
                        style={{
                            paddingTop: ".3125rem",
                            paddingBottom: ".3125rem",
                            marginRight: "1rem",
                            fontSize: "1.25rem",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            color: "#fff",
                        }}
                    >
                        <img
                            src={LOGO}
                            alt=""
                            height="24"
                            style={{
                                display: "inline-block",
                                verticalAlign: "text-top",
                                marginRight: "0.5rem",
                            }}
                        />
                        Bisanya Kapan?
                    </a>
                </div>
            </header>
            <main
                style={{
                    paddingTop: headerRef?.current?.clientHeight,
                    minHeight: contentMinHeight,
                }}
            >
                {children}
            </main>
            <footer ref={footerRef}>
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        style={{ marginBottom: "-1rem" }}
                    >
                        <path
                            fill={COLOR.BLACK}
                            fillOpacity="1"
                            d="M0,256L60,234.7C120,213,240,171,360,170.7C480,171,600,213,720,229.3C840,245,960,235,1080,229.3C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                        ></path>
                    </svg>
                </div>
                <div
                    style={{
                        textAlign: "center",
                        backgroundColor: COLOR.BLACK,
                        paddingBottom: "3rem",
                    }}
                >
                    <div style={{ marginBottom: "1.5rem" }}>
                        <a
                            href="https://trakteer.id/alf-anas"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                id="wse-buttons-preview"
                                src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png"
                                style={{
                                    border: 0,
                                    height: "50px",
                                    margin: "0.5em",
                                }}
                                alt="Trakteer Saya"
                            />
                        </a>
                        <a
                            href="https://www.buymeacoffee.com/alf.anas"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
                                alt="Buy Me A Coffee"
                                style={{
                                    height: "50px",
                                    width: "181px",
                                    margin: "0.5em",
                                }}
                            />
                        </a>
                    </div>
                    <p style={{ marginBottom: 0, color: "white" }}>
                        Created with <HeartFilled style={{ color: "red" }} /> by{" "}
                        <a
                            href="https://geoit.dev"
                            style={{ color: "white", fontWeight: "bold" }}
                        >
                            GeoIT Developer
                        </a>
                    </p>
                    <small
                        style={{ fontSize: "0.875em", color: "#6c757d" }}
                        id="last-modified"
                    >
                        Last Updated :{" "}
                        {preval`module.exports = new Date().toISOString().split('T')[0];`}
                        .
                    </small>
                </div>
            </footer>
        </>
    );
}
