import React, { useEffect, useState, useContext } from "react";
import axios from "../../axios-url";
import { Table, Button, Alert, Row, Col } from 'react-bootstrap';
import Spinner from "../../components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MyContext } from "../../context/MyContext";
import Modalinfo from "../../components/Modalinfo";
import Login from "../Login";
const Students = props => {
    const [classList, setClassList] = useState([]);
    const [load, setLoad] = useState(false);
    const [fognoo, setfognoo] = useState(new Date());
    const [lognoo, setlognoo] = useState(new Date());
    const [cag, setcag] = useState(0);
    const [filterVal, setfilterVal] = useState("");
    const state = useContext(MyContext);
    function toJSONLocal(date) {
        var local = new Date(date);
        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    }
    useEffect(() => {
        axios.post("/myClass.php", {
            "tid": state.theUser.id,
            "fognoo": toJSONLocal(fognoo),
            "lognoo": toJSONLocal(lognoo)
        })
            .then(data => {
                setClassList(data.data);
                if (typeof (data.data) === "object")
                    setcag(parseInt(data.data.length) * 2);
                else
                    setcag(0);
            })
            .catch(err => { });
        return () => {

        }
    }, [fognoo, lognoo])
    let filterArr = [];
    let unique = [];
    if (filterVal !== "") {
        for (let i = 0; i < classList.length; i++) {
            if (classList[i].tuluv == filterVal) {
                filterArr.push(classList[i]);
            }
        }
        try {
            unique = [...new Set(filterArr.map(item => item.ognoo))];
        }
        catch (err) {

        }
    }
    else {
        filterArr = classList;
        try {
            unique = [...new Set(filterArr.map(item => item.ognoo))];
        }
        catch (err) {

        }
    }


    console.log(unique);
    let aa = 1;
    return <>
        <Row className="align-items-end">
            <Col xs="2" className="my-1">
                <label>Эхлэх огноо</label>
                <DatePicker className="form-control"
                    selected={fognoo} onChange={(date) => {
                        setfognoo(date);
                    }}
                    dateFormat="yyyy/MM/dd" />
            </Col>
            <Col xs="2" className="my-1">
                <label>Дараагийн огноо</label>
                <DatePicker className="form-control"
                    selected={lognoo} onChange={(date) => {
                        setlognoo(date);
                    }}
                    dateFormat="yyyy/MM/dd" />
            </Col>
            <Col xs="auto" className="my-1">
                <Button variant="secondary" onClick={() => setfilterVal(4)}> Тасалсан</Button>
            </Col>
            <Col xs="auto" className="my-1">
                <Button variant="secondary" onClick={() => setfilterVal(3)}> Чөлөөтэй</Button>
            </Col>
            <Col xs="auto" className="my-1">
                <Button variant="secondary" onClick={() => setfilterVal(2)}> Өвчтэй</Button>
            </Col>
            <Col xs="auto" className="my-1">
                <Button variant="secondary" onClick={() => setfilterVal("")}> Бүгд</Button>
            </Col>
        </Row>
        {typeof (unique) !== "string" ?
            unique.length > 0 ?
                unique.map((e, index) =>
                    <Button key={index} variant="secondary">{e}</Button>
                )
                : null : null
        }
        {load === false ?
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Огноо</th>
                        <th>Нэр</th>
                        <th>Төлөв</th>
                        <th>Хичээлийн нэр</th>
                        <th>Цаг</th>
                    </tr>
                </thead>
                <tbody>
                    {typeof (filterArr) !== "string" ?
                        filterArr.length > 0 ?
                            filterArr.map((e, index) =>
                                <tr key={index}>
                                    <td>{aa++}</td>
                                    <td>{e.ognoo}</td>
                                    <td>{e.fname} {e.lname}</td>
                                    {e.tuluv == 1 ? <td style={{ color: "#198754" }}>Ирсэн</td> :
                                        (e.tuluv == 2 ? <td style={{ color: "#31D2F2" }}>Өвчтэй</td> :
                                            (e.tuluv == 3 ? <td style={{ color: "#0D6EFD" }}>Чөлөөтэй</td> : <td style={{ color: "#FF0000" }}>Тасалсан</td>))}
                                    <td>{e.lessonName}</td>
                                    <td>{e.cag}-р цаг</td>
                                </tr>)
                            : null : null
                    }
                </tbody>
            </Table> : <Spinner />}
    </>
}
export default Students;
