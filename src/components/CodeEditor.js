import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

export default function CodeEditor({ code, onChange }) {
    return <div style={{
        border: '1px solid black',
        minHeight: 200,
        height: '100%',
        width: 'calc(100%-50px)',
    }}>
        <Editor
            value={code}
            onValueChange={onChange}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
                width: '100%',
                height: '100%',
            }}
            tabSize={4}
        />
    </div>
}