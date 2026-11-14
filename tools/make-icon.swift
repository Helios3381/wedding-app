// Renders the home-screen icon for the wedding site: a gold-rimmed red 囍 seal on a soft blush background,
// with two small hearts and a few gold sparkles. Usage: swift icon.swift <out-dir> [fontPostScriptName]
import AppKit
import CoreText

let args = CommandLine.arguments
let outDir = args.count > 1 ? args[1] : "."
let fontName = args.count > 2 ? args[2] : "STSongti-TC-Bold"
let cs = CGColorSpace(name: CGColorSpace.sRGB)!

func hex(_ s: String, _ a: CGFloat = 1) -> CGColor {
    var v: UInt64 = 0
    Scanner(string: String(s.dropFirst())).scanHexInt64(&v)
    return CGColor(colorSpace: cs, components: [CGFloat((v >> 16) & 255) / 255, CGFloat((v >> 8) & 255) / 255, CGFloat(v & 255) / 255, a])!
}

func circle(_ c: CGPoint, _ r: CGFloat) -> CGRect { CGRect(x: c.x - r, y: c.y - r, width: 2 * r, height: 2 * r) }

func heart(_ ctx: CGContext, _ c: CGPoint, _ w: CGFloat, _ color: CGColor) {
    let p = CGMutablePath()
    p.move(to: CGPoint(x: c.x, y: c.y - w * 0.55))
    p.addCurve(to: CGPoint(x: c.x - w * 0.5, y: c.y + w * 0.15), control1: CGPoint(x: c.x - w * 0.15, y: c.y - w * 0.3), control2: CGPoint(x: c.x - w * 0.5, y: c.y - w * 0.15))
    p.addArc(center: CGPoint(x: c.x - w * 0.25, y: c.y + w * 0.17), radius: w * 0.25, startAngle: .pi, endAngle: 0, clockwise: true)
    p.addArc(center: CGPoint(x: c.x + w * 0.25, y: c.y + w * 0.17), radius: w * 0.25, startAngle: .pi, endAngle: 0, clockwise: true)
    p.addCurve(to: CGPoint(x: c.x, y: c.y - w * 0.55), control1: CGPoint(x: c.x + w * 0.5, y: c.y - w * 0.15), control2: CGPoint(x: c.x + w * 0.15, y: c.y - w * 0.3))
    ctx.addPath(p)
    ctx.setFillColor(color)
    ctx.fillPath()
}

func sparkle(_ ctx: CGContext, _ c: CGPoint, _ r: CGFloat, _ color: CGColor) {
    let p = CGMutablePath()
    for i in 0..<8 {
        let a = CGFloat(i) * .pi / 4 + .pi / 2
        let rr = i % 2 == 0 ? r : r * 0.28
        let pt = CGPoint(x: c.x + cos(a) * rr, y: c.y + sin(a) * rr)
        if i == 0 { p.move(to: pt) } else { p.addLine(to: pt) }
    }
    p.closeSubpath()
    ctx.addPath(p)
    ctx.setFillColor(color)
    ctx.fillPath()
}

func render(_ size: Int, _ name: String) {
    let s = CGFloat(size)
    let ctx = CGContext(data: nil, width: size, height: size, bitsPerComponent: 8, bytesPerRow: 0, space: cs,
                        bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!   // opaque: iOS shows transparency as black
    ctx.setShouldAntialias(true)
    // background: soft blush gradient (iOS adds the rounded corners itself, so the square is fully painted)
    let bg = CGGradient(colorsSpace: cs, colors: [hex("#FFF4EC"), hex("#FFC9D6")] as CFArray, locations: [0, 1])!
    ctx.drawLinearGradient(bg, start: CGPoint(x: 0, y: s), end: CGPoint(x: 0, y: 0), options: [])
    let c = CGPoint(x: s / 2, y: s * 0.5)
    // soft glow behind the seal
    let glow = CGGradient(colorsSpace: cs, colors: [hex("#FFFFFF", 0.85), hex("#FFFFFF", 0)] as CFArray, locations: [0, 1])!
    ctx.drawRadialGradient(glow, startCenter: c, startRadius: 0, endCenter: c, endRadius: s * 0.5, options: [])
    // the seal: gold rim, red disc, thin inner gold line
    let R = s * 0.37
    ctx.setShadow(offset: CGSize(width: 0, height: -s * 0.012), blur: s * 0.03, color: hex("#8A1C2E", 0.35))
    ctx.setFillColor(hex("#E5A93C"))
    ctx.fillEllipse(in: circle(c, R))
    ctx.setShadow(offset: .zero, blur: 0, color: nil)
    let red = CGGradient(colorsSpace: cs, colors: [hex("#E0343F"), hex("#B81D2C")] as CFArray, locations: [0, 1])!
    ctx.saveGState()
    ctx.addEllipse(in: circle(c, R * 0.88))
    ctx.clip()
    ctx.drawLinearGradient(red, start: CGPoint(x: 0, y: c.y + R), end: CGPoint(x: 0, y: c.y - R), options: [])
    ctx.restoreGState()
    ctx.setStrokeColor(hex("#F6D27A"))
    ctx.setLineWidth(max(1, s * 0.007))
    ctx.strokeEllipse(in: circle(c, R * 0.8))
    // 囍 in gold, centred on its glyph bounds
    let font = CTFontCreateWithName(fontName as CFString, R * 1.08, nil)
    let attrs: [NSAttributedString.Key: Any] = [NSAttributedString.Key(kCTFontAttributeName as String): font,
                                                NSAttributedString.Key(kCTForegroundColorAttributeName as String): hex("#FFD978")]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: "囍", attributes: attrs))
    let b = CTLineGetBoundsWithOptions(line, .useGlyphPathBounds)
    ctx.textPosition = CGPoint(x: c.x - b.width / 2 - b.minX, y: c.y - b.height / 2 - b.minY)
    CTLineDraw(line, ctx)
    // two small hearts and gold sparkles around the seal
    heart(ctx, CGPoint(x: s * 0.84, y: s * 0.83), s * 0.13, hex("#E4577E"))
    heart(ctx, CGPoint(x: s * 0.74, y: s * 0.9), s * 0.075, hex("#FF8FB1"))
    sparkle(ctx, CGPoint(x: s * 0.15, y: s * 0.84), s * 0.055, hex("#E5A93C"))
    sparkle(ctx, CGPoint(x: s * 0.12, y: s * 0.2), s * 0.04, hex("#E5A93C"))
    sparkle(ctx, CGPoint(x: s * 0.87, y: s * 0.16), s * 0.035, hex("#E5A93C"))
    let img = ctx.makeImage()!
    let data = NSBitmapImageRep(cgImage: img).representation(using: .png, properties: [:])!
    try! data.write(to: URL(fileURLWithPath: outDir + "/" + name))
    print("wrote \(name) with font \(CTFontCopyPostScriptName(font))")
}

render(180, "apple-touch-icon.png")
render(512, "icon-512.png")
render(64, "favicon.png")
