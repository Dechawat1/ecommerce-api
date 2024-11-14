const prisma = require("../config/prisma")
const stripe = require("stripe")('sk_test_51QDNXPLaNAwSENSfqtf4ynT1qLm7bnaNlxOR166wGbAQT5kZpcrsjN3JOcJ5C44pnj6LvINDrzKaWV7cXrgTaWD900eXdHrs6x');

exports.payment = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where:{
                orderedById: req.user.id
            }
        })
        const amountTHB = cart.cartTotal * 100
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountTHB,
            currency: "thb",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}