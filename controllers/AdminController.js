const Admin = require('../models/Admin')
const User = require('../models/User')
const Post = require('../models/Post')
const argon2 = require('argon2')

const { mutipleMongooseToObject } = require('../util/mongoose')

class AdminController {

    // [GET] /admin/register
    register(req, res) {
        res.render('register')
    }

    // [POST] /admin/register
    postRegister(req, res, next) {
        var user = req.body
        if(user.username.trim().length === 0) {
            res.render('register', {data: {error: 'Please enter Username'}})
        }
        if (user.password !== user.confirmPassword || user.password.trim().length === 0 ) {
            res.render('register', {data: {error: 'Password is not Match'}})
        } 

        // All good
        // const hashedPassword = await argon2.hash(user.password)
        // console.log(hashedPassword)
        const newUser = new Admin(user)
        newUser
            .save()
            .then(() => res.redirect('/admin/login'))
            .catch((error) => {
                res.render('register', {data: {error: 'ERROR'}})
            })
    }

    // [GET] /admin/login
    login(req, res) {
        res.render('login')
    }

    // [POST] /admin/login
    postLogin(req, res, next) {
        // var user = req.body

        if(!req.body.username) {
            res.render('login', {data: {error: 'Please enter username'}})
        } else if(!req.body.password) {
            res.render('login', {data: {error: 'Please enter password'}})
        }

        // All good
        Admin.findOne({ username: req.body.username })
        // console.log(user)
        .then(user => {
            if (!user) {
                res.render('login', {data: {error: 'Incorrect username'}})
            } else if (req.body.password != user.password) {
                res.render('login', {data: {error: 'Incorrect pasword'}})
            } else {
                // All good
                req.session.user = user
                // console.log(req.session.user)
                res.redirect('/admin/dashboard')
            }

           
        }) 
        .catch((error) => {
            res.render('register', {data: {error: 'ERROR'}})
        })
        
        // if (!user) {
        //     res.render('login', {data: {error: 'Incorrect username'}})
        // } else if (req.body.password != user.password) {
        //     res.render('login', {data: {error: 'Incorrect pasword'}})
        // }

        // res.render('login', {data: {error: 'OK'}})
    }

    // [GET] /admin/dashboard
    dashboard(req, res, next) {
        if(req.session.user) {
            res.render('dashboard')
        } else {
            res.redirect('/admin/login')
        }
        
    }

    // [GET] /admin/manage
    manage(req, res, next) {
        // res.render('manage')
        if (req.session.user) {
            User.find({})
            .then(users => {
                res.render('manage', { 
                    users: mutipleMongooseToObject(users)
                })
            }).catch(next)
        } else {
            res.redirect('/admin/login')
        }
        
    }

    // [GET] /admin/user-detail/:id
    userDetail(req, res, next) {
        if ( req.session.user) {
            const userId = req.params.id
            Post.find({ user: userId })
                .then(posts => {
                    res.render('user-detail', { 
                        posts: mutipleMongooseToObject(posts)
                    })
                })
        } else {
            res.redirect('/admin/login')
        }
    }

    // [GET] /admin/logout
    logout(req, res, next) {
        if(req.session.user) {
            req.session.destroy()
            res.redirect('/admin/login')
        } else {
            res.redirect('/admin/login')
        }
    }

}

module.exports = new AdminController();