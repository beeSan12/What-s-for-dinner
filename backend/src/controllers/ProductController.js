/**
 * @file Defines the ProductController.
 * @module ProductController
 * @author Beatriz Sanssi
 */

// Application modules.
// import { NotModifiedError } from '../lib/errors/NotModifiedError.js'
import { convertToHttpError } from '../lib/util.js'
import { ProductService } from '../services/ProductService.js'
import { UserProductService } from '../services/UserProductService.js'
import { logger } from '../config/winston.js'

/**
 * Encapsulates a controller.
 */
export class ProductController {
  /**
   * The service.
   *
   * @type {ProductService}
   * @type {UserProductService}
   */
  #service
  #userProductService

  /**
   * Initializes a new instance.
   *
   * @param {ProductService} service - A service instantiated from a class with the same capabilities as ProductService.
   * @param {UserProductService} userProductService - A service instantiated from a class with the same capabilities as UserProductService.
   */
  constructor (service, userProductService) {
    logger.silly('ProductController constructor')
    this.#service = service
    this.#userProductService = userProductService
  }

   /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the product to load.
   */
   async loadProductDocument (req, res, next, id) {
    try {
      req.doc = await this.#service.getById(id)
      next()
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Sends a JSON response containing a product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Sends a JSON response containing all products.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      // Get the page and per_page query parameters (get the first page
      // with 20 documents per page if not specified).
      const page = Number(req.query?.page) || 1
      const perPage = Number(req.query?.per_page) || 20

      // Get the documents and pagination data.
      const result = await this.#service.get({ page, perPage })

      // Set pagination headers.
      this.#setPaginationHeaders(req, res, result.pagination)

      // Send the response.
      if (result.data.length > 0) {
        res.json(result.data)
      } else {
        res
          .status(204) // No Content
          .end()
      }
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Sends a JSON response containing products that match the search criteria.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async search(req, res, next) {
    try {
      const name = req.query.name?.toString() || ''
      const userId = req.user?.id
      logger.info(`🔍 Searching for: ${name}, userId: ${userId}`)
  
      // Search for products by name.
      // If userId is provided, search for products by name and userId.
      console.log('🔎 Calling global search...')
      const globalProducts = (await this.#service.search({
        filter: { product_name: new RegExp(name, 'i') }
      })).data
      console.log('🔎 Calling user search...')
      const userProducts = userId
      ? (await this.#userProductService.search({
          filter: { product_name: new RegExp(name, 'i'), userId }
        })).data
      : []
  
      // Combine the results.
      const results = [
        ...globalProducts.map(p => ({ ...p.toObject?.() || p, source: 'global' })),
        ...userProducts.map(p => ({ ...p.toObject?.() || p, source: 'custom' }))
      ]
  
      res.json({ data: results })
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Creates a new product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async createCustom(req, res, next) {
    try {
      const productData = req.body
      const saved = await this.#service.insert(productData)
      res.status(201).json(saved)
    } catch (err) {
      next(err)
    }
  }


  /**
   * Sets the pagination headers.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} pagination - The pagination data.
   * @param {number} pagination.totalCount - The total number of documents.
   * @param {number} pagination.page - The current page.
   * @param {number} pagination.perPage - The number of documents per page.
   * @param {number} pagination.totalPages - The total number of pages.
   */
  #setPaginationHeaders (req, res, { totalCount, page, perPage, totalPages }) {
    // Set pagination headers.
    res.set('X-Total-Count', totalCount)
    res.set('X-Page', page)
    res.set('X-Per-Page', perPage)
    res.set('X-Total-Pages', totalPages)

    // Generate and set link header.
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`
    let linkHeader = ''

    // Next page.
    if (page < totalPages) {
      linkHeader += `<${baseUrl}?page=${page + 1}&per_page=${perPage}>; rel="next", `
    }

    // Previous page.
    if (page > 1) {
      linkHeader += `<${baseUrl}?page=${page - 1}&per_page=${perPage}>; rel="prev", `
    }

    // First and last page.
    linkHeader += `<${baseUrl}?page=1&per_page=${perPage}>; rel="first", `
    linkHeader += `<${baseUrl}?page=${totalPages}&per_page=${perPage}>; rel="last"`

    res.set('Link', linkHeader)
  }



// /**
//  * Controller for handling product-related requests.
//  */
// export class ProductController {
//   constructor(productService) {
//     this.productService = productService
//   }

  // /**
  //  * Fetches all products.
  //  *
  //  * @param {object} req - The request object.
  //  * @param {object} res - The response object.
  //  * @param {function} next - The next middleware function.
  //  * @returns {Promise<void>} - A promise that resolves when the response is sent.
  //  */
  // async getAll(req, res, next) {
  //   try {
  //     const result = await this.productService.findAll()
  //     res.json(result)
  //   } catch (err) {
  //     next(err)
  //   }
  // }

  // /**
  //  * Fetches a product by its ID.
  //  *
  //  * @param {object} req - The request object.
  //  * @param {object} res - The response object.
  //  * @param {function} next - The next middleware function.
  //  * @returns {Promise<void>} - A promise that resolves when the response is sent.
  //  */
  // async getById(req, res, next) {
  //   try {
  //     const result = await this.productService.findById(req.params.id)
  //     res.json(result)
  //   } catch (err) {
  //     next(err)
  //   }
  // }

  // /**
  //  * Searches for products by name.
  //  *
  //  * @param {object} req - The request object.
  //  * @param {object} res - The response object.
  //  * @param {function} next - The next middleware function.
  //  * @returns {Promise<void>} - A promise that resolves when the response is sent.
  //  */
  // async search(req, res, next) {
  //   try {
  //     const { name } = req.query
  //     const result = await this.productService.searchByName(name)
  //     res.json(result)
  //   } catch (err) {
  //     next(err)
  //   }
  // }
}