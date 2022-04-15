import { ref, set, push, child, get, update } from "firebase/database";
import moment from "moment";
import { database } from "../firebase";
import { generateRandomNumber } from "../utils/generateRandomNumber";

export async function createEvent(judul, deskripsi, rencanaJadwal, waktu) {
    const pin = generateRandomNumber(6);
    const id = push(child(ref(database), "event")).key;
    return new Promise((resolve, reject) => {
        set(ref(database, "event/" + id), {
            id: id,
            judul: judul,
            deskripsi: deskripsi,
            rencana_jadwal: rencanaJadwal,
            waktu: waktu,
            created_at: new Date().toISOString(),
        })
            .then(() => {
                // Insert PIN di DB Tree lain
                set(ref(database, "pin/" + id + "/" + pin), true)
                    .then(() => {
                        resolve({
                            success: true,
                            data: {
                                id: id,
                                pin: pin,
                            },
                            message: "Berhasil membuat wacana!",
                        });
                    })
                    .catch((err) => {
                        reject({
                            error: true,
                            message: "Gagal membuat wacana!",
                            data: err,
                        });
                    });
            })
            .catch((err) => {
                reject({
                    error: true,
                    message: "Gagal membuat wacana!",
                    data: err,
                });
            });
    });
}

export async function updateEvent(idEvent, judul, deskripsi) {
    return new Promise((resolve, reject) => {
        update(ref(database, "event/" + idEvent), {
            judul: judul,
            deskripsi: deskripsi,
            updated_at: new Date().toISOString(),
        })
            .then(() => {
                resolve({
                    success: true,
                    message: "Berhasil mengupdate wacana!",
                });
            })
            .catch((err) => {
                reject({
                    error: true,
                    message: "Gagal mengupdate wacana!",
                    data: err,
                });
            });
    });
}

export async function getEvent(id) {
    const dbRef = ref(database);
    return new Promise((resolve, reject) => {
        get(child(dbRef, "event/" + id))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    resolve({
                        success: true,
                        data: snapshot.val(),
                        message: "Berhasil mengambil wacana!",
                    });
                } else {
                    reject({
                        error: true,
                        message: "Wacana Tidak Ditemukan!",
                    });
                }
            })
            .catch((err) => {
                reject({
                    error: true,
                    message: "Gagal mengambil data!",
                    data: err,
                });
            });
    });
}

export async function createPolling(idEvent, nama, jadwal = {}) {
    const pollingID = new Date().getTime() + "-" + generateRandomNumber(4);
    return new Promise((resolve, reject) => {
        set(ref(database, "event/" + idEvent + "/polling/" + pollingID), {
            nama: nama,
            tanggal: moment().format("YYYY-MM-DD HH:mm:ss"),
            created_at: new Date().toISOString(),
            ...jadwal,
        })
            .then(() => {
                resolve({
                    success: true,
                    message: "Berhasil mengirim jadwal!",
                });
            })
            .catch((err) => {
                reject({
                    error: true,
                    message: "Gagal mengirim jadwal!",
                    data: err,
                });
            });
    });
}

export async function deletePolling(idEvent, idPolling) {
    return new Promise((resolve, reject) => {
        set(ref(database, "event/" + idEvent + "/polling/" + idPolling), null)
            .then(() => {
                resolve({
                    success: true,
                    message: "Berhasil menghapus data!",
                });
            })
            .catch((err) => {
                reject({
                    error: true,
                    message: "Gagal menghapus data!",
                    data: err,
                });
            });
    });
}

export async function canEdit(idEvent, pin) {
    const dbRef = ref(database);
    return new Promise((resolve, reject) => {
        get(child(dbRef, "pin/" + idEvent + "/" + pin))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    resolve({
                        success: true,
                        data: snapshot.val(),
                        message: "PIN OK!",
                    });
                } else {
                    reject({
                        error: true,
                        message: "PIN SALAH!",
                    });
                }
            })
            .catch((err) => {
                reject({
                    error: true,
                    message: "Gagal mengecek pin!",
                    data: err,
                });
            });
    });
}
