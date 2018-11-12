import React, { Component } from 'react'

import { loadImageAsync, cloneCanvas } from '../utils/util'

const STYLES = {
    container: {
        marginTop: 20,
        borderTop: '1px solid',
    },
}

export default class CutResult extends Component {
    _elContainer

    state = {
        imgs: [],
    }

    render() {
        const {
            props: {
                pieceSize,
                pieceRowCount,
                pieceColumnCount,
            },
            state: {
                imgs,
            },
        } = this

        return (
            <div
                style={STYLES.container}

                ref={this._handleRefContainer}
            >
                <div
                    style={{
                        position: 'relative',
                        width: pieceColumnCount * pieceSize,
                        height: pieceRowCount * pieceSize,
                        margin: 200,
                    }}
                >
                    {
                        imgs.map(
                            (
                                {
                                    top,
                                    left,
                                    src,
                                },
                                i,
                            ) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={i}
                                    style={{
                                        position: 'absolute',
                                        top,
                                        left,
                                        width: pieceSize,
                                        height: pieceSize,
                                    }}
                                />
                            )
                        )
                    }
                </div>
            </div>
        )
    }

    _handleRefContainer = e => {
        if (!e && this._elContainer === e) return
        this._elContainer = e

        this._cut()
    }

    async _cut() {
        const {
            props: {
                cutData: {
                    pieceSize,
                    pieceRowCount,
                    pieceColumnCount,
                    lineWidth,
                    strokeStyle,
                },
            },
        } = this
        const imgCanvas = await this._getImgCanvas()
        const canvas = cloneCanvas(imgCanvas)
        const ctx = canvas.getContext('2d')
        const unitCanvas = document.createElement('canvas')
        unitCanvas.width = unitCanvas.height = Math.ceil(pieceSize * 1.64)
        const unitCtx = unitCanvas.getContext('2d')
        const dSize = (unitCanvas.width - pieceSize) / 2
        const imgs = []

        ctx.lineWidth = lineWidth
        ctx.strokeStyle = strokeStyle

        for (let i = 0; i < pieceColumnCount; i++) {
            for (let j = 0; j < pieceRowCount; j++) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.save()
                ctx.beginPath()

                if (j) {
                    ctx.moveTo(i * pieceSize, j * pieceSize)
                    if ((i + j) & 1) this._jigsawHTLineTo(ctx, i + 1, j)
                    else this._jigsawHBLineTo(ctx, i + 1, j)
                } else {
                    ctx.moveTo(i * pieceSize, j * pieceSize - lineWidth * 2)
                    ctx.lineTo((i + 1) * pieceSize, j * pieceSize - lineWidth * 2)
                }
                if (i < pieceColumnCount - 1) {
                    if ((i + j) & 1) this._jigsawVLLineTo(ctx, i + 1, j + 1)
                    else this._jigsawVRLineTo(ctx, i + 1, j + 1)
                } else {
                    ctx.lineTo((i + 1) * pieceSize + lineWidth * 2, j * pieceSize)
                    ctx.lineTo((i + 1) * pieceSize + lineWidth * 2, (j + 1) * pieceSize)
                }
                if (j < pieceRowCount - 1) {
                    if ((i + j) & 1) this._jigsawHBLineTo(ctx, i + 1, j + 1, true)
                    else this._jigsawHTLineTo(ctx, i + 1, j + 1, true)
                } else {
                    ctx.lineTo((i + 1) * pieceSize, (j + 1) * pieceSize + lineWidth * 2)
                    ctx.lineTo(i * pieceSize, (j + 1) * pieceSize + lineWidth * 2)
                }
                if (i) {
                    if ((i + j) & 1) this._jigsawVRLineTo(ctx, i, j + 1, true)
                    else this._jigsawVLLineTo(ctx, i, j + 1, true)
                } else {
                    ctx.lineTo(i * pieceSize - lineWidth * 2, (j + 1) * pieceSize)
                    ctx.lineTo(i * pieceSize - lineWidth * 2, j * pieceSize)
                }

                ctx.closePath()
                ctx.clip()
                ctx.drawImage(imgCanvas, 0, 0)
                ctx.stroke()
                ctx.restore()

                unitCtx.clearRect(0, 0, unitCanvas.width, unitCanvas.height)
                unitCtx.drawImage(canvas, i * pieceSize - dSize, j * pieceSize - dSize, unitCanvas.width, unitCanvas.height, 0, 0, unitCanvas.width, unitCanvas.height)
                imgs.push({
                    top: j * pieceSize - dSize,
                    left: i * pieceSize - dSize,
                    src: unitCanvas.toDataURL('image/png'),
                })
            }
        }

        this.setState({
            imgs,
        })
    }

    async _getImgCanvas() {
        const {
            props: {
                cutData: {
                    imgSrc,
                    pieceSize,
                    pieceRowCount,
                    pieceColumnCount,
                },
            },
        } = this

        const img = await loadImageAsync(imgSrc)
        const imgCanvas = document.createElement('canvas')
        imgCanvas.width = pieceSize * pieceColumnCount
        imgCanvas.height = pieceSize * pieceRowCount
        const ctx = imgCanvas.getContext('2d')
        ctx.drawImage(img, 0, 0, imgCanvas.width, imgCanvas.height)
        
        // this._elContainer.appendChild(imgCanvas)

        return imgCanvas
    }

    _jigsawLineTo(lineTo, bezierCurveTo) {
        lineTo(76, 0)
        bezierCurveTo(84.6, 0, 91.7, 7, 91.7, 15.7)
        lineTo(91.7, 17.3)
        bezierCurveTo(91.7, 21.2, 90.7, 24.9, 88.9, 28.4)
        bezierCurveTo(86.5, 33.3, 85.4, 39, 86.3, 45.1)
        bezierCurveTo(88.2, 57.5, 98.4, 67.3, 110.9, 68.6)
        bezierCurveTo(127.8, 70.4, 142, 57.3, 142, 40.8)
        bezierCurveTo(142, 36.4, 141, 32.2, 139.1, 28.5)
        bezierCurveTo(137.4, 25, 136.3, 21.3, 136.3, 17.4)
        lineTo(136.3, 15.8)
        bezierCurveTo(136.3, 7.2, 143.3, 0, 152, 0)
        lineTo(228, 0)
    }

    _jigsawLineToWithTransform(ctx, transform) {
        return this._jigsawLineTo(
            (x, y) => ctx.lineTo(...transform(x, y)),
            (cp1x, cp1y, cp2x, cp2y, x, y) => ctx.bezierCurveTo(
                ...transform(cp1x, cp1y),
                ...transform(cp2x, cp2y),
                ...transform(x, y),
            ),
        )
    }

    _jigsawHTLineTo(ctx, i, j, reversed = false) {
        const {
            props: {
                cutData: {
                    pieceSize,
                },
            },
        } = this
        const ratio = pieceSize / 228
        const dx = (i - 1) * pieceSize
        const dy = j * pieceSize

        this._jigsawLineToWithTransform(
            ctx,
            (
                reversed
                    ? (x, y) => [pieceSize - x * ratio + dx, -y * ratio + dy]
                    : (x, y) => [x * ratio + dx, -y * ratio + dy]
            ),
        )
    }

    _jigsawVRLineTo(ctx, i, j, reversed = false) {
        const {
            props: {
                cutData: {
                    pieceSize,
                },
            },
        } = this
        const ratio = pieceSize / 228
        let dx = i * pieceSize
        let dy = (j - 1) * pieceSize

        this._jigsawLineToWithTransform(
            ctx,
            (
                reversed
                    ? (x, y) => [y * ratio + dx, pieceSize - x * ratio + dy]
                    : (x, y) => [y * ratio + dx, x * ratio + dy]
            ),
        )
    }

    _jigsawHBLineTo(ctx, i, j, reversed = false) {
        const {
            props: {
                cutData: {
                    pieceSize,
                },
            },
        } = this
        const ratio = pieceSize / 228
        let dx = (i - 1) * pieceSize
        let dy = j * pieceSize

        this._jigsawLineToWithTransform(
            ctx,
            (
                reversed
                    ? (x, y) => [pieceSize - x * ratio + dx, y * ratio + dy]
                    : (x, y) => [x * ratio + dx, y * ratio + dy]
            ),
        )
    }

    _jigsawVLLineTo(ctx, i, j, reversed = false) {
        const {
            props: {
                cutData: {
                    pieceSize,
                },
            },
        } = this
        const ratio = pieceSize / 228
        let dx = i * pieceSize
        let dy = (j - 1) * pieceSize

        this._jigsawLineToWithTransform(
            ctx,
            (
                reversed
                    ? (x, y) => [-y * ratio + dx, pieceSize - x * ratio + dy]
                    : (x, y) => [-y * ratio + dx, x * ratio + dy]
            ),
        )
    }
}
