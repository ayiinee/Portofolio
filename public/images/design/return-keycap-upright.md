# Upright Enter keycap

Approved visual: `exec-4618ab55-47c6-4e44-bb2d-baf2521b3786.png` from this chat's ImageGen outputs. The rear edge is raised so the navy arrow face looks toward the camera. Powder-blue PBT cap and navy socket, 1536 × 1024 RGBA.

`return-keycap-upright.png` is the subsequent background-extraction edit, `exec-f0ff4199-7986-49f5-97cb-95b32a14ced5.png`. Pixels outside the assembly have zero alpha; their stored RGB colors can still show glow in image viewers that ignore alpha.

`KeycapLink.tsx` renders two aligned copies of this asset. CSS clips at 79.2% of image height: the socket remains stationary, and the cap moves down 2.5% of image height on press, then returns with a spring. The original Enter assets remain available.

Mouse, touch/pointer and keyboard Enter use the same press state. Keyboard Enter activates the Projects link on release, preserving the held-down visual. Modified Enter shortcuts retain native link behavior. Reduced motion suppresses travel.
