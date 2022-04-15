import { Button, Form, Input, Radio, DatePicker, Space, Divider, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { INTERNAL_ROUTE } from "../constants/routes";
import { createEvent } from "../services/event.service";

export const timeType = {
    bebas: "BEBAS",
    spesifik: "SPESIFIK",
};

export default function CreateEvent() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        rencanaJadwal: timeType.bebas,
        waktu: [],
    });
    const [rangeWaktu, setRangeWaktu] = useState([
        moment().subtract(10, "days"),
        moment().add(1, "days"),
    ]);
    const [waktuSpesifik, setWaktuSpesifik] = useState([
        moment().add(1, "days"),
        moment().add(2, "days"),
        moment().add(3, "days"),
        moment().add(4, "days"),
        moment().add(5, "days"),
        moment().add(6, "days"),
    ]);

    async function onBuatWacana(e) {
        e.preventDefault();
        const mWaktu = formData.rencanaJadwal === timeType.bebas ? rangeWaktu : waktuSpesifik;

        if (!formData.judul || !formData.deskripsi || mWaktu.length < 2) {
            message.error("Data Tidak Lengkap!");
            return;
        }

        const eWaktu = mWaktu.map((item) => item.format());

        await createEvent(formData.judul, formData.deskripsi, formData.rencanaJadwal, eWaktu)
            .then((res) => {
                if (res.success && res?.data?.id) {
                    const newID = res?.data?.id;
                    localStorage.setItem("PIN-" + newID, res?.data?.pin);
                    navigate(INTERNAL_ROUTE.EVENT + "/" + newID);
                } else {
                    throw new Error(res.message);
                }
            })
            .catch((err) => {
                if (typeof err === "string") {
                    message.error(err);
                } else {
                    message.error(err.message);
                }
            });
    }

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
                    Buat Wacana!
                </h1>
                <Form
                    layout="vertical"
                    style={{
                        maxWidth: "500px",
                        marginRight: "auto",
                        marginLeft: "auto",
                    }}
                >
                    <Form.Item label="Judul">
                        <Input
                            placeholder="-- Bukber --"
                            value={formData.judul}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    judul: e.target.value,
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Deskripsi">
                        <TextArea
                            rows={4}
                            placeholder="-- Kapan mau bukber nih? --"
                            value={formData.deskripsi}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    deskripsi: e.target.value,
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Rencana Jadwal" style={{ textAlign: "center" }}>
                        <Radio.Group
                            value={formData.rencanaJadwal}
                            buttonStyle="solid"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    rencanaJadwal: e.target.value,
                                });
                            }}
                        >
                            <Radio.Button value={timeType.bebas}>Rentang Waktu Harian</Radio.Button>
                            <Radio.Button value={timeType.spesifik}>Waktu Spesifik</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {formData.rencanaJadwal === timeType.bebas ? (
                        <Form.Item label="Rentang Waktu" style={{ textAlign: "center" }}>
                            <DatePicker.RangePicker
                                value={rangeWaktu}
                                onCalendarChange={(dates) => {
                                    setRangeWaktu(dates);
                                }}
                            />
                        </Form.Item>
                    ) : (
                        <Form.Item label="Buat Pilihan Waktu" style={{ textAlign: "center" }}>
                            <Space direction="vertical">
                                {waktuSpesifik.map((item, idx) => {
                                    return (
                                        <div key={idx}>
                                            <DatePicker
                                                showTime
                                                value={item}
                                                onChange={(dates) => {
                                                    waktuSpesifik[idx] = dates;
                                                    setWaktuSpesifik([...waktuSpesifik]);
                                                }}
                                            />
                                            <Button
                                                type="danger"
                                                onClick={() => {
                                                    waktuSpesifik.splice(idx, 1);
                                                    setWaktuSpesifik([...waktuSpesifik]);
                                                }}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    );
                                })}
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setWaktuSpesifik([...waktuSpesifik, moment()]);
                                    }}
                                >
                                    Tambah Pilihan
                                </Button>
                            </Space>
                        </Form.Item>
                    )}
                    <Divider style={{ borderColor: "lightpink" }} />
                    <Form.Item
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <Button type="primary" size="large" onClick={onBuatWacana}>
                            Buat Wacana
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </MainLayout>
    );
}
