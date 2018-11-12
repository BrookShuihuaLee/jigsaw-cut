import React, { Component } from 'react'

import CutResult from './CutResult'
import IMAGE_EXAMPLE from './example.jpg'

const STYLES = {
    img: {
        minWidth: 100,
    },
}

export default class JigsawCut extends Component {
    state = {
        imgSrc: IMAGE_EXAMPLE,
        pieceSize: 200,
        pieceRowCount: 2,
        pieceColumnCount: 3,
        lineWidth: 3,
        strokeStyle: 'rgba(0, 0, 0, 0.2)',

        // cutData: null,
        cutData: {
            imgSrc: IMAGE_EXAMPLE,
            pieceSize: 200,
            pieceRowCount: 2,
            pieceColumnCount: 3,
            lineWidth: 3,
            strokeStyle: 'rgba(0, 0, 0, 0.2)',
        },
    }
    
    render() {
        const {
            state: {
                imgSrc,
                cutData,
            },
        } = this

        return (
            <section>
                <h1>
                    拼图切图
                </h1>
                <div>
                    <img
                        src={imgSrc}
                        alt="图片"
                        style={STYLES.img}
                    />
                    <input
                        type="file"
                        accept="image/*"
                    />
                </div>
                <div>
                    <button
                        onClick={this._handleClickCut}
                    >
                        切一切
                    </button>
                </div>
                {
                    cutData && (
                        <CutResult
                            cutData={cutData}
                        />
                    )
                }
            </section>
        )
    }

    _handleClickCut = () => {
        const {
            state: {
                imgSrc,
                pieceSize,
                pieceRowCount,
                pieceColumnCount,
                lineWidth,
                strokeStyle,
            },
        } = this

        this.setState({
            cutData: {
                imgSrc,
                pieceSize,
                pieceRowCount,
                pieceColumnCount,
                lineWidth,
                strokeStyle,
            },
        })
    }
}
