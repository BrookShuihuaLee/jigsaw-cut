import React, { Component } from 'react'

import { loadImageAsync } from '../utils/util'

const STYLES = {
    container: {
        marginTop: 20,
        borderTop: '1px solid',
    },
    canvas: {
        margin: 10,
    },
}

export default class CutResult extends Component {
    _elContainer

    render() {
        return (
            <div
                style={STYLES.container}

                ref={this._handleRefContainer}
            >
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
                    lineWith,
                    strokeStyle,
                },
            },
        } = this

        const imgCanvas = await this._getImgCanvas()
        const ctx = imgCanvas.getContext('2d')

        ctx.lineWidth = lineWith
        ctx.strokeStyle = strokeStyle

        ctx.beginPath()
        this._jigsawHBLineTo(ctx, 0, 1)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        this._jigsawHTLineTo(ctx, 2, 1)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        this._jigsawVRLineTo(ctx, 1, 0)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        this._jigsawVLLineTo(ctx, 1, 0)
        ctx.stroke()
        ctx.closePath()
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
        
        this._elContainer.appendChild(imgCanvas)

        return imgCanvas
    }

    _jigsawLineTo(i, j, lineTo, bezierCurveTo) {
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

    _jigsawLineToWithTransform(ctx, i, j, transform) {
        return this._jigsawLineTo(
            i,
            j,
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
            i,
            j,
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
        let dy = j * pieceSize

        this._jigsawLineToWithTransform(
            ctx,
            i,
            j,
            (x, y) => [y * ratio + dx, x * ratio + dy],
        )
    }

    _jigsawHBLineTo(ctx, i, j) {
        const {
            props: {
                cutData: {
                    pieceSize,
                },
            },
        } = this
        const ratio = pieceSize / 228
        let dx = i * pieceSize
        let dy = j * pieceSize

        this._jigsawLineToWithTransform(
            ctx,
            i,
            j,
            (x, y) => [x * ratio + dx, y * ratio + dy],
        )
    }

    _jigsawVLLineTo(ctx, i, j) {
        const {
            props: {
                cutData: {
                    pieceSize,
                },
            },
        } = this
        const ratio = pieceSize / 228
        let dx = i * pieceSize
        let dy = j * pieceSize

        this._jigsawLineToWithTransform(
            ctx,
            i,
            j,
            (x, y) => [-y * ratio + dx, x * ratio + dy],
        )
    }
}
