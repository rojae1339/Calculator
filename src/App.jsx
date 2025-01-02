import './App.css'
import Button from "./components/Button.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faClockRotateLeft, faDeleteLeft} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";

const renderContent = (item) => {
    if (typeof item === "string") {
        if (item.includes("<")) {
            return <span dangerouslySetInnerHTML={{ __html: item}} />;
        }
        return item;
    }
    return item;
};

function App() {

    const operatorsYnums = [
        "%", "CE", "C", <FontAwesomeIcon icon={faDeleteLeft}/>,
        "<sup>1</sup>/<sub>x</sub>", "x<sup>2</sup>", "<sup>2</sup>√x", "÷",
        "7", "8", "9", "×",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        "<sup>+</sup>/<sub>-</sub>", "0", ".", "="
    ];

    const operatorType = [
        {
            0: "remain"
        },
        {
            1: "delete_current"
        },
        {
            2: "delete_all"
        },
        {
            3: "delete_char"
        },
        {
            4: "denominator"
        },
        {
            5: "square"
        },
        {
            6: "sqrt"
        },
        {
            7: "divide"
        },
        {
            20: "alter_sign"
        },
        {
            22: "add_decimal_point"
        },
        {
            23: "calculate"
        }
    ]

    const [result, setResult] = useState("0");
    const [numWithOperator, setNumWithOperator] = useState("");
    const displayRef = useRef();
    const containerRef = useRef();

    //result 값에 따라서 result 에 해당되는 태그 스타일 변경
    useEffect(() => {

        const dispElement = displayRef.current;
        const containElement = containerRef.current;

        const resizeFont = () => {
            if (dispElement && containElement) {
                const displayWidth = dispElement.offsetWidth + 60;
                const containerWidth = containElement.offsetWidth;

                if (displayWidth > containerWidth) {

                    const scale = containerWidth / (displayWidth);
                    displayRef.current.style.transform = `scale(${scale})`;

                } else {

                    displayRef.current.style.transform = "scale(1)";
                }
            }
        };

        resizeFont();

    }, [result]);

    
    //todo 각 오퍼레이터 별 연산 기능 넣고 button컴포넌트 onClick수정해야됨
    
    const onClickNumber = (e) => {
        const val = e.currentTarget.value

        if (isNaN(Number(val))) {
            return
        }

        if (result.length === 21 /*"," 포함 계산*/) {
            return
        }

        setResult((result!=="0" ? (result.replaceAll(",", "") + val).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : val));
    }

    const onClickOperator = (e) => {
        console.log(e.currentTarget);

        setNumWithOperator(e.currentTarget.value)
    }

    return (
        <div className={"flex flex-col text-xl font-bold items-center"}>
            {/*머리*/}
            <div className={"flex flex-row mt-5"}>
                <Button
                    className={""}
                    onClick={() => {
                    }}
                    content={<FontAwesomeIcon icon={faBars}/>}
                />

                <p className={"ml-6"}>표준</p>

                <Button
                    className={"ml-[450px]"}
                    onClick={() => {
                    }}
                    content={<FontAwesomeIcon icon={faClockRotateLeft}/>}
                />
            </div>

            {/*본문*/}
            <main ref={containerRef} className={"mt-8 w-[580px] h-[700px]"}>
                <section className={"h-44 pr-5 flex flex-col shadow-inner rounded-lg bg-gray-200 relative"}>
                    <div
                        className={"mt-5 flex justify-end h-8 text-[16px]"}>
                        {numWithOperator}
                    </div>
                    <div
                        ref={displayRef}
                        className={`absolute w-min right-5 top-14 h-20 text-6xl`}
                        style={{ transform: "scale(1)", transformOrigin: "right center" }}>
                        {result}
                    </div>
                </section>

                <section className={"grid grid-cols-4 grid-rows-5 mt-2 mr-2 ml-2 gap-2 h-auto"}>
                    {operatorsYnums.map((item, index) => (
                        <Button
                            key={index}
                            className={`h-16 rounded-lg shadow-stone-300 shadow-md ${isNaN(Number(item)) ? "bg-gray-100" : ""}`}
                            content={renderContent(item)}
                            onClick={isNaN(Number(item)) ? onClickOperator : onClickNumber}
                            value={item}
                        />
                    ))}
                </section>
            </main>
        </div>
    )
}

export default App
