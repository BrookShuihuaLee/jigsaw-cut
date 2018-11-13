import React, { Component } from 'react'

import CutResult from './CutResult'
import IMAGE_EXAMPLE from './example.jpg'
import { parseIntWithDefault } from '../utils/util';

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
        strokeStyle: 'rgba(0, 0, 0, 0.35)',

        // cutData: null,
        cutData: {
            imgSrc: IMAGE_EXAMPLE,
            pieceSize: 200,
            pieceRowCount: 2,
            pieceColumnCount: 3,
            lineWidth: 3,
            strokeStyle: 'rgba(0, 0, 0, 0.35)',
        },
    }
    
    render() {
        const {
            state: {
                imgSrc,
                pieceSize,
                pieceRowCount,
                pieceColumnCount,
                lineWidth,
                strokeStyle,
                cutData,
            },
        } = this

        return (
            <section>
                <h1>
                    拼图切图
                </h1>
                <div>
                    要切的图片：
                    <img
                        src={imgSrc}
                        alt="图片"
                        style={STYLES.img}
                    />
                    <input
                        type="file"
                        accept="image/*"

                        onChange={this._handleChangeFile}
                    />
                </div>
                <div>
                    每一片的大小：
                    <input
                        type="number"
                        value={`${pieceSize}`}

                        onChange={this._handleChangePieceSize}
                    />
                </div>
                <div>
                    行数：
                    <input
                        type="number"
                        value={`${pieceRowCount}`}

                        onChange={this._handleChangePieceRowCount}
                    />
                </div>
                <div>
                    列数：
                    <input
                        type="number"
                        value={`${pieceColumnCount}`}

                        onChange={this._handleChangePieceColumnCount}
                    />
                </div>
                <div>
                    线宽：
                    <input
                        type="number"
                        value={`${lineWidth}`}

                        onChange={this._handleChangeLineWidth}
                    />
                </div>
                <div>
                    线的颜色：
                    <input
                        value={`${strokeStyle}`}

                        onChange={this._handleChangeStrokeStyle}
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
                            key={JSON.stringify(cutData)}
                            cutData={cutData}
                        />
                    )
                }
            </section>
        )
    }

    _handleClickCut = () => {
        let {
            state: {
                imgSrc,
                pieceSize,
                pieceRowCount,
                pieceColumnCount,
                lineWidth,
                strokeStyle,
            },
        } = this

        pieceSize = parseIntWithDefault(pieceSize, 0)
        pieceRowCount = parseIntWithDefault(pieceRowCount, 0)
        pieceColumnCount = parseIntWithDefault(pieceColumnCount, 0)
        lineWidth = parseIntWithDefault(lineWidth, 0)

        this.setState({
            pieceSize,
            pieceRowCount,
            pieceColumnCount,
            lineWidth,
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

    _handleChangeFile = (
        {
            target: {
                files,
            },
        },
    ) => {
        const fd = new FileReader()
        fd.onload = () => {
            this.setState({
                imgSrc: fd.result,
            })
        }
        fd.readAsDataURL(files[0])
    }

    _handleChangePieceSize = (
        {
            target: {
                value,
            },
        },
    ) => {
        this.setState({
            pieceSize: value,
        })
    }

    _handleChangePieceRowCount = (
        {
            target: {
                value,
            },
        },
    ) => {
        this.setState({
            pieceRowCount: value,
        })
    }

    _handleChangePieceColumnCount = (
        {
            target: {
                value,
            },
        },
    ) => {
        this.setState({
            pieceColumnCount: value,
        })
    }

    _handleChangeLineWidth = (
        {
            target: {
                value,
            },
        },
    ) => {
        this.setState({
            lineWidth: value,
        })
    }

    _handleChangeStrokeStyle = (
        {
            target: {
                value,
            },
        },
    ) => {
        this.setState({
            strokeStyle: value,
        })
    }
}
