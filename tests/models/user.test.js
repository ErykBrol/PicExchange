const chai = require('chai');
const expect = chai.expect;

const User = require('../../models/User');
const ROLES = require('../../models/userRoles');

describe('user model', function () {
   describe('username validation', function () {
      it('error on empty name', function () {
         const user = new User({});
         user.validate(function (err) {
            expect(err.errors.username).to.exist;
         });
      });
      it('error on name shorter than minLength', function () {
         const user = new User({ username: 'a' });
         user.validate(function (err) {
            expect(err.errors.username).to.exist;
         });
      });
      it('error on name longer than maxLength', function () {
         const user = new User({ username: '123456789012345678901' });
         user.validate(function (err) {
            expect(err.errors.username).to.exist;
         });
      });
   });

   describe('password validation', function () {
      it('error on empty password', function () {
         const user = new User({ username: 'valid' });
         user.validate(function (err) {
            expect(err.errors.password).to.exist;
         });
      });
      it('error on password shorter than minLength', function () {
         const user = new User({ username: 'valid' });
         user.validate(function (err) {
            expect(err.errors.password).to.exist;
         });
      });
   });

   describe('downloadCredits validation', function () {
      it('error on empty downloadCredits', function () {
         const user = new User({
            username: 'valid',
            password: 'valid',
         });
         user.validate(function (err) {
            expect(err.errors.downloadCredits).to.exist;
         });
      });
      it('error on downloadCredits less than min', function () {
         const user = new User({
            sername: 'valid',
            password: 'valid',
            downloadCredits: -1,
         });
         user.validate(function (err) {
            expect(err.errors.downloadCredits).to.exist;
         });
      });
   });

   describe('roles validation', function () {
      it('error on role does not exist in role enum', function () {
         // Ensure that the role we set for invalid role testing isn't actually a valid role
         const invalidRole = 'invalid';
         expect(Object.values(ROLES).includes(invalidRole)).to.be.false;

         const user = new User({
            username: 'valid',
            password: 'valid',
            downloadCredits: 5,
            role: invalidRole,
         });
         user.validate(function (err) {
            expect(err.errors.role).to.exist;
         });
      });
      it('default role is set to user', function () {
         const user = new User({
            username: 'valid',
            password: 'valid',
            downloadCredits: 5,
         });
         user.validate(function (err) {
            expect(err).to.not.exist;
         });
         expect(user.role).to.be.equal('user');
      });
   });

   describe('clientUserData virtual', function () {
      it('return obj has username and downloadCredits properties', function () {
         const user = new User({
            username: 'valid',
            password: 'valid',
            downloadCredits: 5,
         });
         const virtual = user.clientUserData;
         expect(virtual).to.exist;
         expect(virtual).to.have.property('username');
         expect(virtual).to.have.property('downloadCredits');
      });
   });

   describe('valid user', function () {
      it('success on valid user creation', function () {
         const user = new User({
            username: 'valid',
            password: 'valid',
            downloadCredits: 5,
         });
         user.validate(function (err) {
            expect(err).to.not.exist;
         });
      });
   });
});
