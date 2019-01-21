# Canvas 3D Camera

## Live Demo

See [this webpage](http://caroline-lin.com/camera).

## Building

1. Install parcelJS using your favourite package manager. I used `npm`.

See install instructions [here](https://parceljs.org/).

I had parcel 1.11.0 on my local machine at the time of install.

2. Clone the repo.

3. From the repo directory, build using `parcel view/index.html`. Assuming parcel works, you should see a dev server with the camera demo.

## About

This demo renders the vertices of a dodecahedron onto a 2D canvas as a point cloud.

The camera viewing the dodecahedron can be rotated. Rotations are implemented with quaternions.

The quaternion implementation was hacked together from an explanation of quaternion algebra done by Grant Sanderson (3b1b) and Ben Eater. You can find out more [here](https://eater.net/quaternions).

I used TypeScript because debugging is easier in type-checked languages.

## License

Probably the MIT License. You are free to use any of the code here with attribution.

## Appendix: Building for 'production'

This section describes how to stick the demo on your server.

Add the flag

`--public-url ./`

to `parcel build view/index.html`

and copy the `dist` folder to your server directory. See my confused [StackExchange question](https://stackoverflow.com/questions/54048932/how-do-i-deploy-my-web-app-built-with-parceljs-on-my-ubuntu-18-10-server).

## Credits

Built by Caroline Lin (caroline-lin).
