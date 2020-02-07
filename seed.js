// var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")

var data = [{
    name: "Taifa",
    image: "https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.webp",
    description: "If you love the outdoors and some hard work, you could start a campground business. Whether you have land or are purchasing land, you could start enjoying the great outdoors and working for yourself as soon as you get everything set up. You'll provide a place for people who are passing through on their way to another destination and for those who want to enjoy some time connecting with nature. Campers use all sorts of shelters from tents to fully contained RVs."
}, {
    name: "Dome",
    image: "https://www.parksconservancy.org/sites/default/files/styles/basic/public/programs/PRSF_130326_APAZ_179_2x1.JPG?itok=YguufFlB",
    description: "This campground, the only overnight facility of its kind in the city, sits atop the highest point in the Presidio, overlooking Baker Beach and the Pacific Ocean. Open to the public by reservation April through October, Rob Hill Campground is also home to the Crissy Field Center’s Camping at the Presidio (CAP) program which provides low-cost camping to educators and community organizations who support youth that have traditionally experienced barriers to their national parks. Community organizations and schools must qualify for the CAP program by meeting eligibility criteria such as offering free to low-cost services or working with families on a limited income or who receive free/reduced lunch. For additional criteria, training information, and next steps, please visit the Camping at the Presidio webpage."
}, {
    name: "Achimota",
    image: "https://cdn.jacksonholewy.net/images/content/14405_832ba2_gros_ventre_campground_lg.jpg",
    description: "Grand Teton National Park has five campgrounds located within the park boundaries. They offer excellent facilities, as well as the perfect place to take a family with kids. Visitors can enjoy a wealth of nearby activities, staying if they wish for as long as two weeks. People flock to the campgrounds in large numbers during the warmer months, enjoying scenery that is beyond compare."

}]



function seedDB() {
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err)
        }
        console.log("campground remove")
        data.forEach(function (seed) {
            Campground.create(seed, function (err, data) {
                if (err) {
                    console.log(err)
                } else {

                    Comment.create({
                            text: "the place is great,but i wish there was internet",
                            author: "homer"
                        },

                        function (err, comment) {
                            data.comments.push(comment)
                            data.save()
                            console.log(comment)

                        })
                }
            })

        })



    })
}
module.exports = seedDB