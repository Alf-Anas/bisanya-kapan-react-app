import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { INTERNAL_ROUTE } from "../constants/routes";

export default function Home() {
    const navigate = useNavigate();
    return (
        <MainLayout>
            <div
                style={{
                    maxWidth: "85%",
                    paddingTop: "2rem",
                    marginRight: "auto",
                    marginLeft: "auto",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: 0,
                        fontSize: "2rem",
                    }}
                >
                    Selamat Datang!
                </h1>
                <p
                    style={{
                        textAlign: "center",
                        marginRight: "auto",
                        marginLeft: "auto",
                        marginTop: 0,
                        maxWidth: "800px",
                        fontSize: "1.25rem",
                    }}
                >
                    Di website ini Anda dapat mengatur dan merencanakan sebuah acara/kegiatan, lalu
                    menyebarkannya kepada teman Anda, untuk mereka menentukan jadwal yang cocok.
                </p>
                <div
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        textAlign: "center",
                    }}
                >
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => {
                            navigate(INTERNAL_ROUTE.CREATE_EVENT);
                        }}
                    >
                        Buat Wacana
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
