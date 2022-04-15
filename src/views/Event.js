import { Button, Divider, Form, Input, Checkbox, Table, message, Modal, Popconfirm } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import MainLayout from "../components/MainLayout";
import { timeType } from "./CreateEvent";
import { useParams } from "react-router-dom";
import { INTERNAL_ROUTE } from "../constants/routes";
import { InfoCircleOutlined } from "@ant-design/icons/lib/icons";
import TextArea from "antd/lib/input/TextArea";
import {
    canEdit,
    createPolling,
    deletePolling,
    getEvent,
    updateEvent,
} from "../services/event.service";

const intialColumns = [
    {
        title: "No",
        dataIndex: "index",
        key: "index",
        className: "header-table",
        render: (_item, _row, idx) => idx + 1,
    },
    {
        title: "Tanggal",
        dataIndex: "tanggal",
        key: "tanggal",
        className: "header-table",
    },
    {
        title: "Nama",
        dataIndex: "nama",
        key: "nama",
        className: "header-table",
    },
];

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
    },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Event() {
    const params = useParams();
    const [columns, setColumns] = useState(intialColumns);
    const [eventData, setEventData] = useState({});
    const [formData, setFormData] = useState({
        nama: "",
        waktu: [],
    });
    const [waktuOptions, setWaktuOptions] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [eventPIN, setEventPIN] = useState("");
    const [modalVisibility, setModalVisibility] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        function processTheData(mData = {}) {
            setEventData(mData);
            if (mData.rencana_jadwal === timeType.bebas) {
                const listDays = [];
                let i = -1;
                do {
                    i = i + 1;
                    listDays.push({
                        label: moment(mData.waktu[0]).add(i, "days").format("DD MMM YYYY"),
                        value: moment(mData.waktu[0]).add(i, "days"),
                    });
                } while (moment(mData.waktu[0]).add(i, "days").isBefore(moment(mData.waktu[1])));
                setWaktuOptions([...listDays]);
            } else {
                if (Array.isArray(mData.waktu)) {
                    const listWaktu = mData.waktu.map((item) => {
                        return {
                            label: moment(item).format("HH:mm - DD MMM YYYY"),
                            value: moment(item),
                        };
                    });
                    setWaktuOptions([...listWaktu]);
                }
            }

            const listData = [];
            const pollingData = mData?.polling;

            if (
                typeof pollingData === "object" &&
                !Array.isArray(pollingData) &&
                pollingData !== null
            ) {
                for (const key in pollingData) {
                    const xData = pollingData[key];
                    if (xData) {
                        for (const xKey in xData) {
                            if (xData[xKey] === true) {
                                xData[xKey] = (
                                    <div
                                        style={{
                                            backgroundColor: "lime",
                                            textAlign: "center",
                                            color: "green",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        ✓
                                    </div>
                                );
                            }
                        }
                        xData.key = key;
                        xData.nama = <b>{xData.nama}</b>;
                        listData.push(xData);
                    }
                }
            }
            setTableData(listData);
        }

        async function getDataEvent() {
            await getEvent(params[INTERNAL_ROUTE.EVENT_ID])
                .then((data) => {
                    if (data.success) {
                        processTheData(data?.data);
                    } else {
                        throw new Error(data.message);
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
        getDataEvent();

        // Cek jika PIN ada di localstorage
        const ePIN = localStorage.getItem("PIN-" + params[INTERNAL_ROUTE.EVENT_ID]);
        setEventPIN(ePIN);
    }, [params]);

    useEffect(() => {
        const newColumns = [...intialColumns];
        waktuOptions.forEach((item) => {
            newColumns.push({
                title: item.label,
                dataIndex: item.value.format(),
                key: item.value.format(),
                className: "header-table",
            });
        });
        setColumns(newColumns);
    }, [waktuOptions]);

    useEffect(() => {
        const mChart = [];

        waktuOptions.forEach((item) => {
            mChart.push({
                waktu: item.label,
                total: tableData.filter((obj) => obj[item.value.format()]).length,
            });
        });
        setChartData(mChart);
    }, [tableData, waktuOptions]);

    async function onKirimJadwal(e) {
        e.preventDefault();

        if (!formData.nama || formData.waktu.length === 0) {
            message.error("Nama dan Pilihan Tanggal wajib diisi!");
            return;
        }
        const mWaktu = {};
        formData.waktu.forEach((item) => {
            mWaktu[item.format()] = true;
        });

        await createPolling(params[INTERNAL_ROUTE.EVENT_ID], formData.nama, mWaktu)
            .then((res) => {
                if (res.success) {
                    window.location.reload();
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

    function editModeTrue() {
        setColumns((oldState) => {
            return [
                {
                    title: "Hapus",
                    dataIndex: "hapus",
                    key: "hapus",
                    className: "header-table",
                    render: (_item, row, idx) => (
                        <Popconfirm
                            title="Hapus data？"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={async () => {
                                await deletePolling(params[INTERNAL_ROUTE.EVENT_ID], row.key)
                                    .then((res) => {
                                        if (res.success) {
                                            setTableData((oldState) => {
                                                oldState.splice(idx, 1);
                                                return [...oldState];
                                            });
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
                            }}
                        >
                            <Button type="danger" size="small">
                                Hapus
                            </Button>
                        </Popconfirm>
                    ),
                },
                ...oldState,
            ];
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
                    Nama Wacana
                </h1>
                <Form
                    layout="vertical"
                    style={{
                        maxWidth: "500px",
                        marginRight: "auto",
                        marginLeft: "auto",
                    }}
                >
                    <Form.Item>
                        <Input
                            placeholder="-- Bukber --"
                            value={eventData.judul}
                            onChange={(e) => {
                                if (!editMode) return;
                                setEventData({
                                    ...eventData,
                                    judul: e.target.value,
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Deskripsi :">
                        <TextArea
                            rows={4}
                            placeholder="-- Kapan mau bukber nih? --"
                            value={eventData.deskripsi}
                            onChange={(e) => {
                                if (!editMode) return;
                                setEventData({
                                    ...eventData,
                                    deskripsi: e.target.value,
                                });
                            }}
                        />
                    </Form.Item>
                    <div style={{ textAlign: "center" }}>
                        <Button
                            danger
                            size="large"
                            onClick={async () => {
                                if (editMode) {
                                    await updateEvent(
                                        params[INTERNAL_ROUTE.EVENT_ID],
                                        eventData.judul,
                                        eventData.deskripsi
                                    )
                                        .then((res) => {
                                            if (res.success) {
                                                message.success(res.message);
                                                setEditMode(false);
                                                setColumns((oldState) => {
                                                    const newState = [...oldState];
                                                    newState.shift();
                                                    return [...newState];
                                                });
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
                                } else {
                                    setModalVisibility(true);
                                }
                            }}
                        >
                            {editMode ? "Simpan Perubahan" : "Edit Wacana"}
                        </Button>
                        <Button
                            type="dashed"
                            size="large"
                            onClick={() => {
                                navigator.share({
                                    title: eventData.judul,
                                    text: eventData.deskripsi,
                                    url: window.location.href,
                                });
                            }}
                        >
                            Bagikan Wacana
                        </Button>
                    </div>
                    <Divider style={{ borderColor: "lightpink" }} />
                    {!editMode && (
                        <>
                            <h1
                                style={{
                                    textAlign: "center",
                                    marginBottom: 0,
                                    fontSize: "2rem",
                                }}
                            >
                                Pilih Jadwal!
                            </h1>
                            <Form.Item label="Nama Kamu">
                                <Input
                                    placeholder="-- Nama --"
                                    value={formData.nama}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            nama: e.target.value,
                                        });
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="Kamu Bisanya Kapan?">
                                <Checkbox.Group
                                    options={waktuOptions}
                                    defaultValue={[...waktuOptions]}
                                    onChange={(listChecked) => {
                                        setFormData({
                                            ...formData,
                                            waktu: listChecked,
                                        });
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                <Button type="primary" size="large" onClick={onKirimJadwal}>
                                    Kirim Jadwal
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form>
                <Divider style={{ borderColor: "lightpink" }} />
                <h2 style={{ textAlign: "center", margin: "2rem" }}>Hasil Polling Saat Ini</h2>
                <Table columns={columns} dataSource={tableData} scroll={{ x: true }} />
                <Bar
                    options={options}
                    data={{
                        labels: chartData.map((item) => {
                            return item.waktu;
                        }),
                        datasets: [
                            {
                                label: "Hasil Polling",
                                backgroundColor: "lime",
                                borderColor: "green",
                                data: chartData.map((item) => {
                                    return item.total;
                                }),
                            },
                        ],
                    }}
                />
            </div>
            <Modal
                title="Edit Wacana"
                visible={modalVisibility}
                onOk={() => {
                    async function checkEdit() {
                        await canEdit(params[INTERNAL_ROUTE.EVENT_ID], eventPIN)
                            .then((res) => {
                                if (res.success) {
                                    setEditMode(true);
                                    editModeTrue();
                                    setModalVisibility(false);
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

                    checkEdit();
                }}
                onCancel={() => {
                    setModalVisibility(false);
                }}
            >
                <p>
                    ID : <b>{params[INTERNAL_ROUTE.EVENT_ID]}</b>
                </p>
                <Form.Item
                    label="PIN"
                    tooltip={{
                        title: "Nomor PIN tersimpan otomatis di browser pembuat Wacana, bagikan PIN ini untuk memberikan akses kepada teman Anda untuk bisa mengedit Wacana.",
                        icon: <InfoCircleOutlined />,
                    }}
                >
                    <Input
                        placeholder="-- 000000 --"
                        value={eventPIN}
                        type="number"
                        onChange={(e) => {
                            setEventPIN(e.target.value);
                        }}
                    />
                </Form.Item>
            </Modal>
        </MainLayout>
    );
}
