const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const db = require('../db')();


// Create user
router.post('/', [
    check('FName').exists(),
    check('LName').exists(),
    check('OrganizationId').exists(),
    check('RoleId').exists(),
    check('Email').isEmail(),
    check('Password').exists(),
    check('SignUpTime').exists()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    };

    const data = req.body;

    db.query("INSERT INTO EndUser (FName,LName,OrganizationId,RoleId,Email,SignUpTime) \
    VALUES (?, ?, ?, ?, ?, ?)",
        [data.FName, data.LName, data.OrganizationId, data.Email, data.RoleId, data.Email, data.SignUpTime],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(JSON.stringify([{
                    "Message": "User Creation Failed"
                }]));
            } else {
                db.query("INSERT INTO Log_In(Email,Password,UsrId) VALUES (?, ?, ?)",
                [data.Email, data.Password, result.insertId],
                (err, result2) => {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send(JSON.stringify([{
                            "Message": "User Creation Failed"
                        }]));
                    } else {
                        res.send(JSON.stringify([{
                            "Message": "User Created Successfully",
                            UserId: result.insertId
                        }]));
                    }
                });
                
            }
        })
});

// Verify user
router.post('/verify', [
    check('Email').exists(),
    check('Password').exists()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    };

    const data = req.body;

    db.query("SELECT UsrId from Log_In where Email = ?",
    [data.Email],
    (err, result) => {
        if (err) {
            res.status(401);
            res.send(JSON.stringify([{
                "Message": "Invalid Credentials"
            }]));
        } else {
            const userId = result[0].UsrId;
            dbb.query("SELECT EndUser.* , Organization.Name as Company,MapRole.RoleName as Role,Log_In.Password as Password FROM EndUser INNER JOIN Organization ON EndUser.OrganizationId = Organization.OrganizationId INNER JOIN MapRole ON EndUser.RoleId = MapRole.RoleId  INNER JOIN Log_In ON Log_In.UsrId = EndUser.UsrId WHERE UsrId = ?",
            [userId],
            (err, result2) => {
                if (err) {
                    res.status(401);
                    res.send(JSON.stringify([{
                        "Message": "Invalid Credentials"
                    }]));
                } else {
                    const userData = result2[0];
                    res.send(JSON.stringify([userData]));
                }
            });
        }
    });
});

// Get user details
router.get('/:UserId', (req, res) => {
    db.query("SELECT * FROM EndUser WHERE UsrId = ?", [req.params.UserId], 
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(404);
            res.send(JSON.stringify([{
                "Message": "Invalid UserID"
            }]));
        } else {
            const data = res[0];
            res.send(JSON.stringify([data]));
        }
    })
});

module.exports = router;