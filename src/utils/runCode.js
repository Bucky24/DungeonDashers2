export default async function runCode(code, data = {}) {
    const wrappedCode = `return (async () => {\n${code}\n})()`;

    try {
        let myFunc = new Function(wrappedCode);
        myFunc = myFunc.bind(data);

        return await myFunc();
    } catch (error) {
        console.error(`Error running code ${code}: ${error.message}`)
    }
}