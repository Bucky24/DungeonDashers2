import React from 'react';
import { connect } from 'react-redux';
import { Rect, Text, Image, CanvasComponent, ButtonTypes } from '@bucky24/react-canvas';

import { dismissDialog } from './store/ducks/map';

class Dialog extends CanvasComponent {

    onMouseUp({ button }, overMe) {
        if (overMe && button === ButtonTypes.LEFT) {
            this.props.clearDialog();
        }
    }

    render() {
        const { x, y, width, height, text, characterIdent, characterData } = this.props;

        this.bounds = {
            x,
            y,
            width,
            height,
        };

        // very rough algorithm for breaking up text into lines
        const lines = [];
        for (let i=0;i<text.length;i+=50) {
            lines.push(text.substr(i, 50));
        }

        return <>
            <Rect
                x={x}
                y={y}
                x2={x+width}
                y2={y+height}
                color="#fff"
                fill={true}
            />
            {lines.map((line, index) => {
                return <Text
                x={x+25}
                y={y+25+12*(index+1)}
                >{line}</Text>
            })}
        </>;
    }
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {
		clearDialog: () => {
            dispatch(dismissDialog());
        },
 	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
