package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Stock int     `json:"stock"`
}

type CartItem struct {
	ProductID int     `json:"product_id"`
	Name      string  `json:"name"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

var products = []Product{
	{ID: 1, Name: "Laptop", Price: 25000, Stock: 5},
	{ID: 2, Name: "Headphones", Price: 1500, Stock: 10},
	{ID: 3, Name: "Mouse", Price: 700, Stock: 15},
}

var cart = []CartItem{
	{ProductID: 2, Name: "Headphones", Quantity: 1, Price: 1500},
	{ProductID: 3, Name: "Mouse", Quantity: 2, Price: 1400},
}

func getProducts(c *gin.Context) {
	c.JSON(http.StatusOK, products)
}

func addToCart(c *gin.Context) {
	var req struct {
		ProductID int `json:"product_id"`
		Quantity  int `json:"quantity"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Quantity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Quantity must be greater than 0"})
		return
	}

	for _, p := range products {
		if p.ID == req.ProductID {
			for i, item := range cart {
				if item.ProductID == p.ID {
					cart[i].Quantity += req.Quantity
					cart[i].Price = float64(cart[i].Quantity) * p.Price
					c.JSON(http.StatusOK, gin.H{"message": "Updated cart", "cart": cart})
					return
				}
			}

			cart = append(cart, CartItem{
				ProductID: p.ID,
				Name:      p.Name,
				Quantity:  req.Quantity,
				Price:     float64(req.Quantity) * p.Price,
			})

			c.JSON(http.StatusOK, gin.H{"message": "Added to cart", "cart": cart})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
}

func getCart(c *gin.Context) {
	c.JSON(http.StatusOK, cart)
}

func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "healthy"})
}

func main() {
	r := gin.Default()

	r.GET("/health", healthCheck)

	r.GET("/products", getProducts)

	r.POST("/cart", addToCart)
	r.GET("/cart", getCart)

	r.Run(":8080")
}
