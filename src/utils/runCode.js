export default async function runCode(code, data = {}) {
    const wrappedCode = `return (async () => {\n${code}\n})()`;

    let myFunc = new Function(wrappedCode);
    myFunc = myFunc.bind(data);

    return await myFunc();
}