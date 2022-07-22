
const uint256 = require("starknet").uint256;

function toUint256WithFelts(num) {
    const n = uint256.bnToUint256(num);
    return {
        low: BigInt(n.low.toString()),
        high: BigInt(n.high.toString()),
    };
}

function fromUint256WithFelts(uint256WithFelts) {
    return uint256.uint256ToBN({
        low: uint256WithFelts.low.toString(),
        high: uint256WithFelts.high.toString(),
    });
}

function strToFeltArr(str) {
    const size = Math.ceil(str.length / 31);
    const arr = Array(size);

    let offset = 0;
    for (let i = 0; i < size; i++) {
        const substr = str.substring(offset, offset + 31).split("");
        const ss = substr.reduce(
            (memo, c) => memo + c.charCodeAt(0).toString(16),
            ""
        );
        arr[i] = BigInt("0x" + ss);
        offset += 31;
    }
    return arr;
}

function feltArrToStr(felts) {
    return felts.reduce(
        (memo, felt) => memo + Buffer.from(felt.toString(16), "hex").toString(),
        ""
    );
}

module.exports = {
    toUint256WithFelts,
    fromUint256WithFelts,
    feltArrToStr,
    strToFeltArr,
};