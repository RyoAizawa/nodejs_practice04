const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "survey_db",
});

// 外部静的ファイルの取得
app.use(express.static("assets"));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    // チェックボックスが何か選択されていれば、配列⇒文字列連結した形に変換する
    if (req.body["where"] !== "") {
        // 空文字はここで削除
        req.body["where"].splice(req.body["where"].indexOf(""), 1);
        // 配列で送られてきたデータは文字列に変換
        const whereStr = req.body["where"].join();
        req.body["where"] = whereStr;
    }
    const sql = "INSERT INTO survey SET ?";
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        res.render("result");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
