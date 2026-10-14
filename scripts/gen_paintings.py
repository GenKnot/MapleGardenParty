import random, math
import os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "paintings") + "/"
W,H=600,720

HEAD=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img">
<defs>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.48  0 0 0 0 0.38  0 0 0 0.10 0"/></filter>
<filter id="ink" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="9"/><feGaussianBlur stdDeviation="0.8"/></filter>
<filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="soft2"><feGaussianBlur stdDeviation="14"/></filter>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf7ee"/><stop offset="1" stop-color="#f2eadb"/></linearGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
'''
FOOT='<rect width="600" height="720" filter="url(#paper)"/></svg>\n'


def ridge(pts, bottom):
    d=f"M{pts[0][0]} {pts[0][1]}"
    for i in range(1,len(pts)):
        x0,y0=pts[i-1]; x1,y1=pts[i]
        d+=f" Q{x0+(x1-x0)*0.5:.0f} {min(y0,y1)-14:.0f} {x1} {y1}" if (y0<y1) != (i%2==0) else f" Q{x0+(x1-x0)*0.5:.0f} {min(y0,y1)-8:.0f} {x1} {y1}"
    return d+f" L{pts[-1][0]} {bottom} L{pts[0][0]} {bottom}Z"

def moon():
    r=random.Random(11)
    s=HEAD
    s+='<defs><radialGradient id="glow"><stop offset="0" stop-color="#f1d79a" stop-opacity=".75"/><stop offset="1" stop-color="#f1d79a" stop-opacity="0"/></radialGradient>'
    s+='<linearGradient id="far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9b3a6" stop-opacity=".75"/><stop offset="1" stop-color="#b9b3a6" stop-opacity="0"/></linearGradient>'
    s+='<linearGradient id="mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a847a"/><stop offset="1" stop-color="#b8b2a5" stop-opacity=".2"/></linearGradient></defs>'
    s+='<circle cx="430" cy="170" r="150" fill="url(#glow)"/>'
    s+='<path d="M430 108 A62 62 0 0 0 430 232 Z" fill="#ecd397" opacity=".96"/>'
    s+='<path d="M430 108 A62 62 0 0 0 430 232" fill="none" stroke="#caa86a" stroke-width="1.4" opacity=".8"/>'
    # clouds
    for cx,cy,rx in [(120,150,90),(250,230,120),(520,290,70)]:
        s+=f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="12" fill="#fffdf6" opacity=".8" filter="url(#soft)"/>'
    # far mountains
    s+='<path d="'+ridge([(-20,430),(40,372),(100,410),(175,330),(255,412),(325,362),(405,424),(475,342),(560,414),(640,372)],520)+'" fill="url(#far)" filter="url(#soft)"/>'
    # mid mountains
    s+='<path d="'+ridge([(-20,520),(70,444),(130,482),(215,402),(305,488),(365,450),(445,506),(525,440),(640,506)],600)+'" fill="url(#mid)" opacity=".75" filter="url(#ink)"/>'
    # near cliff left with pines
    s+='<path d="M-20 720 L-20 470 Q60 440 120 500 Q150 560 230 600 Q150 640 170 720Z" fill="#46423a" opacity=".9" filter="url(#ink)"/>'
    for (x,y,h) in [(40,480,110),(90,500,85),(18,520,70)]:
        s+=f'<path d="M{x} {y+h} L{x} {y} M{x-26} {y+h*0.35} L{x} {y+h*0.12} L{x+26} {y+h*0.35} M{x-34} {y+h*0.6} L{x} {y+h*0.32} L{x+34} {y+h*0.6}" stroke="#2f2c26" stroke-width="3.2" fill="none" stroke-linecap="round" filter="url(#ink)"/>'
    # river
    s+='<rect x="0" y="590" width="600" height="130" fill="#e7e2d4" opacity=".55"/>'
    for i in range(16):
        y=600+i*7.5; x1=r.uniform(120,300); x2=x1+r.uniform(90,240)
        s+=f'<path d="M{x1:.0f} {y:.0f} Q{(x1+x2)/2:.0f} {y-3:.0f} {x2:.0f} {y:.0f}" stroke="#8b867c" stroke-width="{r.uniform(.8,1.8):.1f}" fill="none" opacity="{r.uniform(.25,.5):.2f}"/>'
    for i in range(7):
        y=606+i*12; w=70-i*6
        s+=f'<path d="M{430-w} {y} L{430+w} {y}" stroke="#d6b673" stroke-width="2.4" stroke-linecap="round" opacity="{0.75-i*0.08:.2f}"/>'
    s+=FOOT
    open(OUT+"moon.svg","w").write(s)

def willow():
    r=random.Random(5)
    s=HEAD
    s+='<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe9d2" stop-opacity=".7"/><stop offset="1" stop-color="#dfe9d2" stop-opacity="0"/></linearGradient>'
    s+='<linearGradient id="wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfdcd0" stop-opacity=".9"/><stop offset="1" stop-color="#e4ebde" stop-opacity=".5"/></linearGradient></defs>'
    s+='<rect width="600" height="420" fill="url(#sky)"/>'
    s+='<path d="M-20 520 L70 470 L140 500 L230 450 L330 510 L420 490 L520 515 L640 500 L640 540 L-20 540Z" fill="#aeb8a6" opacity=".45" filter="url(#soft)"/>'
    s+='<rect x="0" y="520" width="600" height="200" fill="url(#wat)"/>'
    for i in range(14):
        y=545+i*13; x=r.uniform(20,300); w=r.uniform(120,320)
        s+=f'<path d="M{x:.0f} {y} Q{x+w/2:.0f} {y-4} {x+w:.0f} {y}" stroke="#7f9a86" stroke-width="{r.uniform(.8,1.8):.1f}" fill="none" opacity="{r.uniform(.2,.45):.2f}"/>'
    # trunk
    s+='<path d="M470 720 C455 600 480 500 450 400 C440 340 450 290 440 250 L462 250 C474 300 478 350 492 410 C515 500 505 600 520 720Z" fill="#3b362e" filter="url(#ink)"/>'
    # main branches
    branches=[((448,262),(300,170),(120,190)),((452,270),(560,190),(590,230)),((446,300),(350,250),(230,290))]
    s+='<g stroke="#3f3a31" fill="none" stroke-linecap="round" filter="url(#ink)">'
    for a,c,b in branches:
        s+=f'<path d="M{a[0]} {a[1]} Q{c[0]} {c[1]} {b[0]} {b[1]}" stroke-width="10"/><path d="M{a[0]} {a[1]} Q{c[0]} {c[1]} {b[0]} {b[1]}" stroke-width="3" stroke="#6b6456" opacity=".6"/>'
    s+='</g>'
    def pt(a,c,b,t):
        x=(1-t)**2*a[0]+2*(1-t)*t*c[0]+t*t*b[0]; y=(1-t)**2*a[1]+2*(1-t)*t*c[1]+t*t*b[1]; return x,y
    strands=""
    for a,c,b in branches:
        n=46
        for i in range(n):
            t=min(0.97,0.1+0.9*(i+r.uniform(-0.4,0.4))/n); x,y=pt(a,c,b,t)
            L=r.choice([r.uniform(90,220),r.uniform(180,330),r.uniform(260,440),r.uniform(320,440)]); sw=r.uniform(-48,48)
            d=f'M{x:.0f} {y:.0f} C{x+sw*0.2:.0f} {y+L*0.3:.0f} {x-sw:.0f} {y+L*0.7:.0f} {x+sw*0.4:.0f} {min(y+L,540):.0f}'
            col=r.choice(["#6f8f5e","#7ea06a","#5f7d52"])
            strands+=f'<path d="{d}" stroke="{col}" stroke-width="{r.uniform(1,2):.1f}" fill="none" opacity="{r.uniform(.5,.85):.2f}"/>'
            strands+=f'<path d="{d}" stroke="#9cc283" stroke-width="5" stroke-dasharray="{r.choice(["3 9","6 14","4 18","8 11"])}" stroke-linecap="round" fill="none" opacity="{r.uniform(.25,.5):.2f}"/>'
    s+=strands
    # swallow
    s+='<path d="M120 380 q14 -14 30 -2 q-14 -2 -30 2z M150 378 q16 -12 32 2 q-16 -4 -32 -2z" fill="#2c2924" opacity=".85" transform="rotate(-12 150 380)"/>'
    s+=FOOT
    open(OUT+"willow.svg","w").write(s)

def lotus():
    r=random.Random(9)
    s=HEAD
    s+='<defs><radialGradient id="sun" cx=".8" cy=".12" r=".6"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>'
    s+='<linearGradient id="pond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7e3d0" stop-opacity=".2"/><stop offset="1" stop-color="#b8cfb4" stop-opacity=".75"/></linearGradient>'
    s+='<radialGradient id="leaf"><stop offset="0" stop-color="#4f7f4d"/><stop offset=".7" stop-color="#7aa56c"/><stop offset="1" stop-color="#a9c79a"/></radialGradient>'
    s+='<linearGradient id="pet" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fbe3df"/><stop offset=".55" stop-color="#e48a82"/><stop offset="1" stop-color="#bf3a33"/></linearGradient></defs>'
    s+='<rect width="600" height="720" fill="url(#sun)"/>'
    s+='<rect x="0" y="250" width="600" height="470" fill="url(#pond)"/>'
    leaves=[(130,560,150,52,-6),(440,610,160,56,5),(300,470,120,40,0),(70,430,95,32,8),(520,440,90,30,-8),(250,650,110,38,3)]
    for cx,cy,rx,ry,rot in leaves:
        s+=f'<g transform="rotate({rot} {cx} {cy})" filter="url(#ink)"><ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#leaf)" opacity=".92"/>'
        for k in range(14):
            a=k/14*2*math.pi
            s+=f'<line x1="{cx}" y1="{cy}" x2="{cx+rx*0.92*math.cos(a):.0f}" y2="{cy+ry*0.92*math.sin(a):.0f}" stroke="#3f6a3f" stroke-width=".9" opacity=".5"/>'
        s+='</g>'
    # stems
    s+='<g stroke="#4c7a49" stroke-width="3.4" fill="none" stroke-linecap="round" filter="url(#ink)">'
    s+='<path d="M330 720 C320 600 345 470 328 330"/><path d="M420 720 C410 640 440 560 452 450"/><path d="M200 720 C215 640 190 560 205 480"/>'
    s+='</g>'
    # flower
    fx,fy=328,320
    s+=f'<g transform="translate({fx} {fy})" filter="url(#ink)">'
    for ang in [-72,-48,-24,0,24,48,72]:
        s+=f'<path d="M0 0 C-26 -34 -22 -84 0 -112 C22 -84 26 -34 0 0Z" fill="url(#pet)" stroke="#a23a34" stroke-width="1.1" opacity=".95" transform="rotate({ang}) scale(.96)"/>'
    for ang in [-36,0,36]:
        s+=f'<path d="M0 0 C-22 -26 -18 -62 0 -86 C18 -62 22 -26 0 0Z" fill="#fff4f0" opacity=".55" transform="rotate({ang})"/>'
    s+='<ellipse cx="0" cy="-8" rx="16" ry="8" fill="#e9c35b"/></g>'
    # bud
    s+='<g transform="translate(452 440)" filter="url(#ink)"><path d="M0 0 C-14 -20 -12 -50 0 -70 C12 -50 14 -20 0 0Z" fill="url(#pet)" stroke="#a23a34" stroke-width="1"/></g>'
    # dragonfly
    s+='<g transform="translate(500 330) rotate(-20)" stroke="#2f2c26" stroke-width="1.4" fill="none"><path d="M0 0 L36 0"/><path d="M10 0 q-4 -16 -18 -14 M10 0 q-4 16 -18 14 M20 0 q-2 -14 -14 -16 M20 0 q-2 14 -14 16" opacity=".7"/></g>'
    s+=FOOT
    open(OUT+"lotus.svg","w").write(s)

moon(); willow(); lotus()
print("ok")
