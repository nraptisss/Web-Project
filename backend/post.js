const { application } = require('express');
const express = require('express');
const Sequelize = require('sequelize');
const { Shop , Product , Deal , Review, User} = require('./new');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const jwt = require('jsonwebtoken');

// Use the cors middleware to enable CORS
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/deals/review', async (req, res) => {
  try {

    // Find the deal with the specified id
    const deal = await Deal.findByPk(req.body.dealId);
    const user = await User.findOne({ where: {username: deal.fk_user}});

    // Check if the user has already liked the deal
    const existingReview = await Review.findOne({
      where: {
        vote: true,
        fk_user: req.body.fk_user,
        fk_deal: req.body.dealId,
      },
    });

    if (existingReview) {
      // Return an error if the user has already liked the deal
       res.status(400).json({
        success: false,
        message: 'You have already liked this deal',
      });
      return
    }

    // Increment the likes or dislikes field, depending on the value of the vote parameter
    if (req.body.vote === 'like') {
      deal.likes += 1;
      user.totalPoints +=5
    } else if (req.body.vote === 'dislike') {
      deal.dislikes += 1;
      user.totalPoints -= 1;
    }

    // Create a new review entry
    const review = await Review.create({
      vote: req.body.vote === 'like',
      date: new Date(),
      fk_user: req.body.fk_user,
      fk_deal: req.body.dealId,
    });

    // // Save the updated deal and user to the database
    await deal.save();
    await user.save()

    // Return a success response
    res.json({
      success: true,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
  
  
  
  
// Create a middleware function to validate JWTs
const validateJWT = (req, res, next) => {
  // Get the JWT from the request header
  const token = req.headers['x-access-token'];

  // If a token was provided, validate it
  if (token) {
    // Verify the JWT and decode its payload
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        // If the token is invalid, return an error
        return res.json({
          success: false,
          error: 'Invalid token',
        });
      } else {
        // If the token is valid, save the decoded
        // payload to the request object
        req.decoded = decoded;

        // Continue to the next middleware function
        next();
      }
    });
  } else {
    // If no token was provided, return an error
    return res.status(403).send({
      success: false,
      error: 'No token provided',
    });
  }
};


  // app.post("/create_deal", validateJWT ,async (req, res) => {
  //   try {

  //   let fk_user = req.decoded.username;
  //   // Extract the information about the new deal from the request body
  //   const { price, fk_product, fk_shop } = req.body;
    
    
  //   // Set default values for likes and dislikes
  //   const likes = 0;
  //   const dislikes = 0;
    
  //   // Get the shop with the provided fk_shop id
  //   const shop = await Shop.findOne({ where: { id: fk_shop } });
    
  //   // Get all shops with the same name as the provided shop
  //   const sameNameShops = await Shop.findAll({ where: { name: shop.name } });
    
  //   console.log({
  //     price,
  //     likes,
  //     dislikes,
  //     fk_user,
  //     fk_product,
  //     fk_shop
  //   })

  //   // Create the new deal using the provided information
  //   const newDeal = await Deal.create({
  //     price,
  //     likes,
  //     dislikes,
  //     fk_user,
  //     fk_product,
  //     fk_shop
  //   });
    
  //   // // For each shop with the same name, create a new deal with the same information
  //   // for (let i = 0; i < sameNameShops.length; i++) {
  //   //   await Deal.create({
  //   //     price,
  //   //     likes,
  //   //     dislikes,
  //   //     fk_user,
  //   //     fk_product,
  //   //     fk_shop: sameNameShops[i].id
  //   //   });
  //   // }
    
  //   // Send a response to the client with the new deal
  //   res.json({ deal: newDeal });
  // } catch (error) {
  //   // console.log(error)
  //   // If there was an error, send a response to the client with the error
  //   res.status(500).json({ error: error.message });
  //   }
  //   });

    //update product from admin page endpoint
    app.post("/products/:id", async (req, res) => {
      try {
        // Get the product ID from the request parameters
        const productId = req.params.id;
        // Get the updated product data from the request body
        const { name, category, subcategory } = req.body;
    
        // Update the product in the database
        const updatedProduct = await Product.update(
          { name, category, subcategory },
          { where: { id: productId } }
        );
        const updatedProduct1 = await Product.findByPk(productId);
        // Send the updated product data as the response
        res.json(updatedProduct1);
      } catch (error) {
        // Handle any errors that occurred during the update
        console.error(error);
        res.status(500).send(error.message);
      }
    });

    //delete product from admin page endpoint
    app.delete("/products/:id", async (req, res) => {
      try {
        // Get the product ID from the request parameters
        const productId = req.params.id;
        
        // Delete the product from the database
        const updatedProduct = await Product.destroy(
          { where: { id: productId } }
        );
        const updatedProduct1 = await Product.findByPk(productId);
        // Send the updated product data as the response
        res.json(updatedProduct1);
      } catch (error) {
        // Handle any errors that occurred during the update
        console.error(error);
        res.status(500).send(error.message);
      }
    });

    app.post("/addproduct", async (req, res) => {
      try {
        // Get the product data from the request body
        const { id, name, category, subcategory } = req.body;
    
        // Check if a product with the specified ID already exists
        const existingProduct = await Product.findByPk(id);
        if (existingProduct) {
          // If a product with the specified ID already exists, send a response with an error message
          res.status(400).send("A product with the specified ID already exists");
          return;
        }
    
        // Create a new product in the database
        const newProduct = await Product.create({ id, name, category, subcategory });
        
        // Send the new product data as the response
        res.json(newProduct);
      } catch (error) {
        // Handle any errors that occurred during the creation of the product
        console.error(error);
        res.status(500).send(error.message);
      }
    });

    app.post("/create_deal", validateJWT , async (req, res) => {
      try {
      
      
      // check if someone has submitted a deal for the same product at the same store in the past week
      const existingDeal = await Deal.findOne({
        where: {
          fk_product: req.body.productId,
          fk_shop: req.body.shopId,
          createdAt: {
            [Op.gte]: new Date( new Date() - (7 * 24 * 60 * 60 * 1000))
          }
        }
      });
      
      if (existingDeal) {
        // check if new price is 20% lower than the current active deal for the same product at the same store
        if (req.body.price >= existingDeal.price * 1.2) {
          return res
            .status(400)
            .json({ error: "You cannot submit the same deal for the same product at the same store again, unless the price is 20% lower than the corresponding active deal" });
        } else {
          // update the existing deal
          existingDeal.price = req.body.price;
          existingDeal.createdAt = new Date();
          await existingDeal.save();
          return res.status(200).json({ message: "Deal updated successfully" });
        }
      }
      
      // // check if new price is 20% lower than the current active deal for the same product at the same store
      // const activeDeal = await Deal.findOne({
      //   where: {
      //     fk_product: req.body.productId,
      //     fk_shop: req.body.shopId,
      //     createdAt: {
      //       [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
      //     }
      //   }
      // });
      
      // if (activeDeal && req.body.price >= activeDeal.price * 1.2) {
      //   return res
      //     .status(400)
      //     .json({ error: "The new price must be at least 20% lower than the current active deal for this product at this store" });
      // }
      
      // create the new deal
      const newDeal = await Deal.create({
        price: req.body.price,
        likes: 0,
        dislikes: 0,
        fk_user: req.decoded.username,
        fk_product: req.body.productId,
        fk_shop: req.body.shopId
      });


      const currentUser = await User.findOne({
        where:{
          username:req.decoded.username
        }
      })
      currentUser.Points += 50;
      currentUser.save();
      // // check if deal meets criteria for point 5.a.i or 5.a.ii
      // const averagePrice = await getPreviousDayAveragePrice(req.body.productId);
      // if (req.body.price < averagePrice * 0.8) {
      //   await addPointsToUser(req.body.username, 50);
      // }
      
      // // check if deal receives more likes than dislikes
      // if (newDeal.likes > newDeal.dislikes) {
      //   await addPointsToUser(req.body.username, 20);
      // }
      
      // // schedule deletion of deal after one week
      // setTimeout(async () => {
      //   await newDeal.destroy();
      // }, 7 * 24 * 60 * 60 * 1000);
      
      // return res.status(200).json({ message: "Deal created successfully" });

      } catch (err) {
      return res.status(500).json({ error: "Error creating deal" });
      }
      });

      const getTotalUsersAndTokens = async () => {
        const totalUsers = await User.count();
        const totalTokens = totalUsers * 100 * 0.8;
        return { totalUsers, totalTokens };
    }

    const distributeTokens = async () => {
      // Retrieve total users and tokens
      const { totalUsers, totalTokens } = await getTotalUsersAndTokens();
  
      // Retrieve all users and their evaluation scores
      const users = await User.findAll();
  
      // Calculate the proportion of tokens each user should receive
      const tokenProportion = totalTokens / totalPoints;

      // Distribute tokens to each user based on their evaluation score
      users.forEach(async (user) => {
        user.tokens += Math.round(user.totalPoints * tokenProportion);
        await user.save();
});
}
      
    app.post('/token/distribute', async (req, res) => {
      try {
        await distributeTokens();
        res.json({
          success: true,
          message: 'Tokens distributed successfully'
        });
        } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
        }
        });

  module.exports = app;


