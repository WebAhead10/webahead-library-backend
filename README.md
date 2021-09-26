# Webahead library API

> Please if you feel like something is missing from the README then either raise an issue or contact me.

## Setup

- Clone repo
- `npm i`
- ask @Karyum for the enviroment varialbes.


## API routes

To see all of the existing routes of the server we made a data file for [insomnia](https://insomnia.rest/), called `insomnia.json` (it's the same idea for postman), all you need to do is download insomnia and import the file and you would have all the routes.


## Project development guide

> This guide is meant to help create a consistent and healthy code base that is easier to maintain and read.

1) Use typescript `example.ts`
2) Clear variable names.
3) If you are adding a new route make sure to add it to insomnia and then export the file.
> in insomnia add the route for both local and production
4) Comments for ambiguous or unclear code.
5) Use `async/await`
6) **Handle errors**


## Terminology

### Document

A document is a file stored in AWS S3, it can be anything from a newspaper to a birth certificate or any old document that people might have and want to preserve.

The way to view a document on the frontend is through the [OpenSeaDragon editor](https://openseadragon.github.io/).

It's the main entity that we work with in the API or website, almost everything else revolves around it.

### Overlay

An overlay is a section of the document, for example one article from a newspaper or a specific section of a document. 

It's called an overlay because when we want to show or highlight a section/article of a document in OpenSeaDragon we would put an overlay above it, for OpenSeaDragon an overlay is just a div with `x`, `y`, `height` and `width` (overlays are usually rectangles).

So in our API an overlay is part of the document, in the database the overlay would also contain the text that it highlights (the text from the document part or section) and also tags to further explain what is it about.

