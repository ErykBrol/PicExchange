const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');

const Image = require('../../models/Image');

describe('image model', function () {
   describe('filename validation', function () {
      it('error on fileExtValidator with non-image extension', function () {
         const image = new Image({ filename: 'test.doc' });
         image.validate(function (err) {
            expect(err.errors.filename).to.exist;
         });
      });
      it('no error on fileExtValidator with png file extension', function () {
         const image = new Image({ filename: 'test.png' });
         image.validate(function (err) {
            expect(err.errors.filename).to.not.exist;
         });
      });
      it('error on file with empty filename', function () {
         const image = new Image({});
         image.validate(function (err) {
            expect(err.errors.filename).to.exist;
         });
      });
   });

   describe('path validation', function () {
      it('error on file with empty path', function () {
         const image = new Image({ filename: 'test.png' });
         image.validate(function (err) {
            expect(err.errors.path).to.exist;
         });
      });
      it('no error on filename with provided path', function () {
         const image = new Image({ filename: 'test.png', path: 'path/test.png' });
         image.validate(function (err) {
            expect(err.errors.path).to.not.exist;
         });
      });
   });

   describe('description validation', function () {
      beforeEach(function () {
         uploader = mongoose.Types.ObjectId();
      });
      it('no error on file without description', function () {
         const image = new Image({ filename: 'test.png', path: 'path/test.png', uploader: uploader });
         image.validate(function (err) {
            expect(err).to.not.exist;
         });
      });
      it('error on empty string description', function () {
         const image = new Image({ filename: 'test.png', path: 'path/test.png', uploader: uploader, description: '' });
         image.validate(function (err) {
            expect(err.errors.description).to.exist;
         });
      });
   });

   describe('downloads validation', function () {
      beforeEach(function () {
         uploader = mongoose.Types.ObjectId();
      });
      it('default value of downloads is 0', function () {
         const image = new Image({ filename: 'test.png', path: 'path/test.png', uploader: uploader });
         image.validate(function (err) {
            expect(err).to.not.exist;
         });
         expect(image.downloads).to.be.equal(0);
      });
   });
});
