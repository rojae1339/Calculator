import './App.css'
import Button from "./components/Button.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faClockRotateLeft, faDeleteLeft} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";

const renderContent = (item) => {
    if (typeof item === "string") {
        if (item.includes("<")) {
            return <span dangerouslySetInnerHTML={{__html: item}}/>;
        }
        return item;
    }
    return item;
};

const makeResultWithoutComma = (result) => {
    return result.replaceAll(",", "");
}

const makeResultWithComma = (result) => {
    return result.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const makeNumDecimal = (int, count) => {

    //todo 부동소수점 문제 해결
    const factor = Math.pow(10, count); // 10^count

    console.log(int, factor);
    return int / factor;
}

const countDecimalToPairArray = (int) => {

    let count = 0;
    let copy = int;

    while (copy.toString().includes('.')) {
        copy *= 10;
        count++;
    }

    return [copy, count];
}

const deleteZeroFromResult = (result) => {

    let count = 0;

    for (let i = result.length-1; i >= 0 ; i--) {

        if (result[i] === "0") {
            count++;
        } else {
            break;
        }
    }

    const slice = result.slice(0, `${count === 0 ? result.length : -count}`);
    return slice;
}

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
    let [numWithOperator, setNumWithOperator] = useState("");
    const [isNewInput, setIsNewInput] = useState(false)
    const displayRef = useRef();
    const containerRef = useRef();

    //result 값에 따라서 result 에 해당되는 태그 스타일 변경
    useEffect(() => {

        const dispElement = displayRef.current;
        const containElement = containerRef.current;

        const resizeFont = () => {
            if (dispElement && containElement) {
                const displayWidth = dispElement.offsetWidth + 65;
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

    const onClickNumber = (e) => {

        const val = e.currentTarget.value.split(' ')[0];

        if (isNaN(Number(val))) {
            return
        }

        if (result.length === 21 /*"," 포함 계산*/) {
            return
        }

        if (!isNewInput) {
            setResult((result !== "0" ? (makeResultWithComma(makeResultWithoutComma(result) + val)) : val));
        } else {
            //연산자 입력후 숫자클릭시 새로운 result 만들기
            setResult(val.toString());
            setIsNewInput(false);
        }
    }

    const onClickOperator = (e) => {

        const split = e.currentTarget.value.split(' ');
        let resultWithoutComma = makeResultWithoutComma(result);
        const eventValue = split[0];
        const eventIndex = Number(split[1]);

        const numWithOperSplit = numWithOperator.split(' ');
        switch (eventIndex) {
            // Percentage operator
            case 0:
                //입력창에 0만 있을경우
                if (resultWithoutComma === "0") {
                    break
                }
                //연산자가 붙지않은경우
                if (numWithOperator === "") {
                    setResult("0");
                    break
                }

                // 소수점이 이미 있는 경우
                if (resultWithoutComma.includes(".")) {

                    //지수표현이 이미 된 경우
                    if (resultWithoutComma.includes("e")) {
                        const string = resultWithoutComma.split("-");
                        const original = string[0];
                        const e = Number(string[1]);

                        setResult(`${original}-${e + 2}`);
                        break;
                    }

                    const strings = resultWithoutComma.split(".");
                    let integerPart = strings[0];
                    let decimalPart = strings[1];

                    //소수점 아래가 18자리 초과인 경우 지수표현
                    if (decimalPart.length > 15) {
                        let first = "";
                        let count = 0;
                        let original = ""

                        for (let i = 0; i < decimalPart.length; i++) {
                            const char = decimalPart[i];

                            if (char > 0 && first === "") {
                                first = char;
                                count = i;
                            }
                            original += char > 0 ? char : "";
                        }

                        //0.9999999999999999 일때 다음수는 9.99999999999999e-2가 되어야하므로 count +2
                        setResult(`${first}.${original}e-${count + 2}`)
                        break;
                    }

                    if (integerPart === "0") {
                        //int 부분이 0인 소수인 경우
                        decimalPart = deleteZeroFromResult("00" + decimalPart);
                        setResult(`0.${decimalPart}`);
                        break;

                    } else {
                        //int 부분이 1 이상인 경우
                        switch (integerPart.length) {
                            case 1:
                                decimalPart = "0" + integerPart + decimalPart;
                                setResult(`0.${deleteZeroFromResult(decimalPart)}`);
                                break;
                            case 2:
                                decimalPart = integerPart + decimalPart;
                                setResult(`0.${deleteZeroFromResult(decimalPart)}`);
                                break;
                            default:
                                //1,123,111.98같은 int 부분이 3자리 이상인 경우
                                decimalPart = integerPart.slice(-2) + decimalPart;
                                setResult(`${makeResultWithComma(integerPart.slice(0, -2))}.${deleteZeroFromResult(decimalPart)}`);
                                break;
                        }
                    }
                } else {
                    //todo 소수점이 없는경우
                    if (resultWithoutComma.length === 1) {
                        setResult(`0.0${deleteZeroFromResult(resultWithoutComma)}`);
                        break;
                    } else if (resultWithoutComma.length === 2) {
                        setResult(`0.${deleteZeroFromResult(resultWithoutComma)}`);
                        break;
                    }

                    //소수점이 없는 경우, 3자리수 이상일때
                    const change = resultWithoutComma.slice(-2);
                    const original = resultWithoutComma.slice(0, -2);
                    const full = makeResultWithComma(original) + "." + change;
                    const deleteZeroFull = deleteZeroFromResult(full)

                    const splitFull = deleteZeroFull.split('.');

                    if (splitFull[1] === '') {
                        setResult(makeResultWithComma(splitFull[0]))
                        break;
                    }

                    setResult(`${makeResultWithComma(deleteZeroFull)}`);
                }

                break;

            // CE operator
            case 1:
                setResult("0");
                break;

            // C operator
            case 2:
                setResult("0");
                setNumWithOperator("");
                break;

            // BackSpace operator
            case 3:

                if (result.length > 0) {

                    const withoutCommaResult = makeResultWithoutComma(result);
                    const arr = [];

                    for (let i = 0; i < withoutCommaResult.length -1; i++) {

                        arr.push(withoutCommaResult[i]);
                    }

                    if (arr.length === 0) {
                        setResult("0");
                        break
                    }

                    setResult(makeResultWithComma(arr.join("")));
                }
                break;

            // Divide operator
            case 7:
                if (numWithOperator === "") {
                    setNumWithOperator(result + " " + eventValue);
                    setIsNewInput(true);
                    break;
                } else if (numWithOperSplit[1] !== eventValue) {

                    const oper = numWithOperSplit[1];
                    //todo 연산 기호 바꿀시 연산후 기호 변경
                    if (!isNewInput) {
                        switch (operatorsYnums.indexOf(oper)) {
                            case 11:
                                break
                            case 15:
                                break
                            case 19:
                                break
                        }
                    }
                    setNumWithOperator(numWithOperSplit[0] + " " + "÷");
                    setIsNewInput(true);
                } else {
                    //무한연산
                    let numRes = Number(resultWithoutComma);
                    let splitNum = Number(makeResultWithoutComma(numWithOperSplit[0]));

                    if (numWithOperSplit.length < 3 && numWithOperator.includes("÷")) {

                        const [changeSplitNum, splitDecimalCount] = countDecimalToPairArray(splitNum);
                        const [changeNumRes, numResDecimalCount] = countDecimalToPairArray(numRes);

                        const [numIntPart, numDecimalPart] = makeNumDecimal(changeSplitNum / changeNumRes, splitDecimalCount + numResDecimalCount).toString().split('.');

                        const multiple = `${makeResultWithComma(numIntPart.toString())}${numDecimalPart === undefined ? "" : `.${numDecimalPart}`}`;

                        setResult(multiple);
                        setNumWithOperator(multiple + " " + eventValue);
                        setIsNewInput(true);
                        break;
                    }
                }


                break;

            // Multiply operator
            case 11:
                if (numWithOperator === "") {
                    setNumWithOperator(result + " " + eventValue);
                    setIsNewInput(true);
                    break;

                } else if (numWithOperSplit[1] !== eventValue) {

                    const oper = numWithOperSplit[1];
                    //todo 연산 기호 바꿀시 연산후 기호 변경
                    if (!isNewInput) {
                        switch (operatorsYnums.indexOf(oper)) {
                            case 11:
                                break
                            case 15:
                                break
                            case 19:
                                break
                        }
                    }

                    setNumWithOperator(numWithOperSplit[0] + " " + "×")
                    setIsNewInput(true);
                } else {
                    // 2*2*2*2*2*2*... 같이 연산 반복할 시 무한연산
                    let numRes = Number(resultWithoutComma);
                    let splitNum = Number(makeResultWithoutComma(numWithOperSplit[0]));

                    if (numWithOperSplit.length < 3 && numWithOperator.includes("×")) {

                        const [changeSplitNum, splitDecimalCount] = countDecimalToPairArray(splitNum);
                        const [changeNumRes, numResDecimalCount] = countDecimalToPairArray(numRes);

                        const [numIntPart, numDecimalPart] = makeNumDecimal(changeSplitNum / changeNumRes, splitDecimalCount + numResDecimalCount).toString().split('.');

                        const multiple = `${makeResultWithComma(numIntPart.toString())}${numDecimalPart === undefined ? "" : `.${numDecimalPart}`}`;

                        setResult(multiple);
                        setNumWithOperator(multiple + " " + eventValue);
                        setIsNewInput(true);
                        break;
                    }
                }
                break;

            //todo subtract operator
            case 15:
                break

            //todo addition operator
            case 19:
                break

            //todo change sign operator
            case 20:
                break;

            //todo decimal point operator
            case 22:
                break

            //todo operation operator
            case 23:
                if (numWithOperSplit.length)
                    break;
        }
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
            <main ref={containerRef} className={"mt-8 w-[580px] h-[700px] whitespace-nowrap"}>
                <section className={"h-44 pr-5 flex flex-col shadow-inner rounded-lg bg-gray-200 relative"}>
                    <div
                        className={"mt-5 flex justify-end h-8 text-[16px] text-gray-500 font-medium"}
                    >
                        {numWithOperator}
                    </div>
                    <div
                        ref={displayRef}
                        className={`absolute right-5 top-14 h-20 text-6xl `}
                        style={{transform: "scale(1)", transformOrigin: "right center"}}
                    >
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
                            value={`${typeof item === "string" ? item : "icon"} ${index}`}
                        />
                    ))}
                </section>
            </main>
        </div>
    )
}

export default App
