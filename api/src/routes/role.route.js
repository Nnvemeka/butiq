const router = require('express').Router()
const RoleCtrl = require('../controllers/role.controller')

router.post('/role', RoleCtrl.createRole)
router.get('/user', RoleCtrl.getUserRole)
router.get('/:roleId', RoleCtrl.getRole)

module.exports = router