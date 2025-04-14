export class UserController {
  constructor(userService) {
    this.userService = userService
  }

  async register(req, res, next) {
    const result = await this.userService.register(req.body)
    res.json(result)
  }

  async login(req, res, next) {
    const result = await this.userService.login(req.body)
    res.json(result)
  }
}