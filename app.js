var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var localStrategy = require("passport-local");
var passport = require("passport");
var session = require("express-session");
var Campground = require("./models/campground");
const Comment = require("./models/comment");
var seedDB = require("./seed");
var User = require("./models/user");
app.use(express.static(__dirname + "/public"));

// ===============================================================
mongoose.connect(
  "mongodb+srv://yelpcam:yelpcam@cluster-up6gw.mongodb.net/yelp_camp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  },
  function(err, connect) {
    if (err) {
      console.log(err);
    } else {
      console.log(connect);
    }
  }
);
// =================================================================

// mongoose.connect("mongodb://localhost:27017/yelp_camp", {
//   useNewUrlParser: true
// });
// seedDB()

app.use(
  session({
    secret: "my mom is the best woman",
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
// Campground.create(
//   {
//     name: "Taifa",
//     image:
//       "http://1.bp.blogspot.com/-LnoL0AIsIek/VVcXgstTbuI/AAAAAAAAAow/eES9ULzhFq8/s1600/kantanka%2Bbuilding1.jpg",
//     description:
//       "DescriptionTaifa is a town in the Ga East Municipal District, a district in the Greater Accra Region of south-eastern Ghana near the capital Accra. Taifa is the twenty-sixth largest settlement in Ghana, in terms of population, with a population of 68,459 people. Taifa is located in the northwest suburbs area of Accra."
//   },
//   function(err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(campground);
//     }
//   }
// );
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.set("view engine", "ejs");

// var campgrounds = [
//   {
//     name: "Taifa",
//     image:
//       "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEhUSEhIWFRUWFRYVFRYXFRYXFxUXFxUXFxUXFxcYHSggGBolHRYVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAABAAIDBAUGB//EAEYQAAEDAgQDBQYEAwQHCQAAAAEAAhEDIQQFEjFBUWEGEyJxgTJCkaGxwSNS0fBysuEUM2KSFRZDU4Kz8QckY3ODosLD0v/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACYRAAICAQQCAgIDAQAAAAAAAAABAhEDEiExQRNRBCJhkWKB8FL/2gAMAwEAAhEDEQA/AKjnJsJ0JALoSOUEIgJwCMK6JEE4IQiAnQhyUJBFUkA1FGEk6EBJGEYToAIhGEYRQCCIShEBFDCEQkAiEUAUQgmis2YLgPVTJpclKLfBIipmYckEtLXAb6SDHmNx8FHpQmnwDVcgRRhKE6ACSMIwigAijCMIoAJIwjCKGNTXKSE0hFDIkk6EkDMtEBIBOAWSM2ABGEQEYVIQIRhOARhUIaiEUoVIBQlCMJQmIEIwjCcAmA2EYUxg9FZaGaY4hS2NIoEwnAKPEtbxtcetwm0y54gS2eMS74cBZZyypOi1CyxCY+oB1PII4lzgLkDnYD5rKfmDWt0tgmBJ4WEb8VlPPXBpHGWX6iAXuA6Cw9f0U2FxdBlifQCPsqFGg6pdxstPD4BnJcznJs3UUjXy3GYMv1Bxa7S5sHY6hG8WU+Z4dxqd4b0jMFgZeTYyLOjqRPNVqfZsvbIbB84KqMbisMToJji08fNpsVKm07BxTLLsP+Uh3GB7QA5tNx57dSotKnpZrQqEd43unj3mzE89O7fMSrONpv0awG1BwqNM+eot39RPVdMPk+zGWIz9KOlWxhCWh7fE0yRsHW38Mna8xKg0rpjJS4M2mhkJaU+EoVCGQknQlCAGwgQnQlCBkJaknwkgDK0ogIowskSwQjCKICokCdCQCKYDYToRhEBUIbCMJ0IwmIaAnAIgIwgAQoalc7NAPMk2Cbj3tDfEYEib3gEEx1ssjGZi59mjS0DhAgcyeHmufNlaelG+OF7ss4nENB/M6foZ+oTqbsQ7Yho4WUeT0WxqkHkenqtim1cUrvc6FRzuaOrf7SpIAuSbATx9T81Tw2IaXsDRqDjufMizfTcz6LYz6lqY4RMgCI38QWXgMvcCx7raOHUOJ8R2HDmei2xRjTkzOcndI6TDDwt/hH0WlgGyQsNuNgBrRqIAHSwVijXxPCB6A/Vc7kbJHpOWs8IVivg2PEObK4XBZ5jaXAOHKB9oXQZb2uovtVaabue4/UfAqbCipnnZxulzmcPiPXiuRw9atRdqpPM7GLHyLT7Xldem42sx9Fxa9pBBiCDJiY84BsvN8fhXNc4OaRfUJFiJIkHiPENl1YMUciaZlObizUw+eU6jQyq3uyDZ1MQAQTfRwuSTHwVsYQkS1zXgk6dLpJA/wmDOxjhKuYDIadaix2x0smb3NNpPzJWF+DRq1KNXVYw1zYOmDIJad9xxCzU3jk6KcVJFgtQhWcQWuJewtc0uJsdpkgEGCD5hQEL0YyUlaOZqthkJQnwlCYEcJQpITSEARwknQkgZkhGEYCIasUSwQjCMIwrJBCICMIgJoQAEYRATgFQDYRhOARhMQ2EYTgFTxOZ0qZAJm5Fr3ESI9VLklyNKzLqhtSqSC6NJJDhEERaNxYixWJi3OLiwTAdVaGgbw0AWG5W9Srue9z3NazwRE3HLWeapOrMBOhslxJmCZLjJgbn6W2XJrjGTZ0KLaSL+UuFOkNdtvk0TtveVbGaU+AcfJv8AVUcDgy7xPmZ2K16dIAbLmk3J2bxSSMjHZi020n1sPWN1UdUc6NRAGzZsDePC3j6K9njIa5wiWtkWmDe91zWHJ70FxJJ0kk9KbT9lpjxa7b6JlOuDs8FQAaDG4C1cJSkrPwnst/hH0Wrg6rAbuA81k9i+Tpstymk5tx6yocb2Wa72fmPuFp5Ni6RAAeCehlazmqbGedYjJ8RhzrYXNjiDb4hQYbtCR4a1IEHcgBpM82xpf6j1XfYrHUWy1zwDE9Be0leZ5vrZVe0iwDSGuFrhlwPU7LXDj1t0ROSXJ3GQ5ph3N0teBtDS3QRYCI2O3ArI7SYNjsQ1pAh+t0xN2sZHzKzcFkLqlMVGjcAwCbSL2PCZT6GJfSeKVd50i41Akt5RxG3CyLcZOwq47EmIycUKrgDIi3kf+iGla+bubUIqMIc3SAS0yAZO8bLMIXdhrQqMMl6tyLSlCfCULUzI4QIUkIEJDIoST4RQMxwiGJ0IgLJEghKE8BGFQhkdEQAnwjATEN0ownaUzE1RTY57j4Wgk87fdMAhO0quzMaR97hOx25zEKSpiG6S5pDiASGtIJNjyU+SPsel+jPzTGPBNNvhMCXHcz+UcT/VY2Jry/U46jAAaPZaSAXD1dO3xRxWKfUPj8AcQA2+q9gI/WAos0HdmGnT4bkC+zdjw34LnblkkbJKKJ8PQc+Q6wa0kNECDbhw343WbXxBEhvhHjaeZ0iBJ9eEBa2S0yG1DzL4sbgxtO6iOFpMu65lxuAd9/DsP+InyRHRjk7G9UlsauSj8Fn8Lf5QtJmyw8JVqPEM8LZN9z8f0VoZeT7T3H1K5ZSt2jeMaQ7NKQc0g7EQTIEA9Ss1jqVP2RJgCRaYECXm524QEzMsNok6jAEnjboOaoUcZ4w1rLQDqcZcZZqsBZvz81cFOSaQnpXJvUW1HgX0tgQBy4K5QytvU+qkwTfA3+EfRaWGasmi7IaOQFw8Id6SVaw2Jx2HsyqSB7rrjyg7ei7DJANIWjWwjH+00HzH3SCzz92a03Fxr0XNc+NTmEwY2Olxt6EeSt4jD4XFO1MqeLSGxqh1tvC8DV5ArfxfZ2m72ZHTcLgMywLaVQsMzcy0yNyPZPlzWuFSu4ckT01uehdncEadPuzJ0jct0zLnkW8iOKxe12XtdVYSPaDW34e3cEX5LCynHYpg/BrEtHAzFokaXSBuNlq/6XdXc1ldkPBGlzDF+Eg2Ik9E22p/YVfX6lYZO6i5rtUBzZgHedx5KaFtZwzwUpEWIPyWTC7MFadjDI3ZFCUKSEIWxBHCBCkhAhAEMJKSEkDMbR1KcGnmnAIwsUxMbf8AY/qj+94TgE4KyRsFG/L6I6U6ExDRHX4FYnaavIbSAJ1HU6OQPhHq7+UrfErCz8jUPEGwBqINyAT4T02UTdIqKtlBgBDyagBYXcNW8kNO3CbCePVY4zF0EsqsIbe8sieHjABnzV2tXAktpmDMkxLrciNon4rLxfcBpBpOaDuPEJuDvJjbgFzPSdCs02Mq1H03ADTopusZBOpxIETNovtfdXMfXpayTDiIAi/I3JsLjqVk0sSCGNL9AcG6GNE2IOkn/KbmTZWsymnV0sIHgBvvOqLF23opUpNpIKS3Zdp95UB3YInjflJNysxmJZpJaLhuoF+w8Yb7LfM7k+S1so2qn/xHX3/Lus/B5ZqBmRLdMCHH2w65sBtzTjGMZ/YHJuOx0GW+w0/HbfitDTZZdDFU6bQ0uEi0DxHptZTjHSLU3nrDR/8AJYSas1inRTzymTTeALlpjjw6LFw2BN3GdTWNlukzdumOYPSFq4/Hj3mO9TA26SSoaVaoR4RoBgSIYD/xG5+KuGRxTUexOKbtm1hKgaxuo6TGxsfgrVPNaLS28y6DANrEztfaI6rLwWDBAJkyrrqABZA/2gHyKzbZao7DKu0uEbAL482uv8rLpcJmVCr7FRp6BwJ+G64uhkLqgsAekhMq9mHj3CPIj7FRuPY67tBmowtJ1SNRggDYEwYnpZcTmeGdiHitTaSRUa1zI2GsuLhfa5ER1U/d4ykIFR4H5XjU34Osohn9Vp01KTHgHgC36W+S0xZJQdoicE0afYnDOaHNewi7pa5pBuKcSD/CUztplbRFRoiGkENgSdQA4R7wUuW9p8KCC5tRnSdbBO8cfkr+aYijimBtGowmxgmDZ7HbG/u8lpKanO32SouMaOawGHxNMNIqODDwM6T5A2KvQtEMP9lpSIIgESDB0yRItuqRC6cFJGWRtsjhCFJpS0razOiKECFLCaQnY6ItKSk0pJWFGGAnAKzh6AO6JwjrrBTQaWVwEYT3MIQhaJkUCEgEUQqsVCAXLdqCGVJaACWEkxJkbRNhv8l1YC5nOK9M1XeEvc3w6QJI23BtwB2Uykktyop3sc73RdSeJu91UST+aGySsXG0X0azmF86Kbp0uOkllItkeoXS4qs8eItYAJMmpEAbydhdZ+KxxAk0y8Rt3gc0/Dh5FYOS9GyTH4DCPc+i+0CnT3MknTUBgb7ub0utvMKdPvS97hsABvxmdLb787LMp13Fwpl4bNtDARsJvHCBxKdjtNJ+lrQdjJk+8Rt6KUpSaobpcmjSxpIcKbJ5l0Ab8GNt81Vr4lx/vKth7rYNpj2W2+KtZRULqbnG9xFgLajwC50C3/p//Yrhg1SakxSyUtjsMuwrQ3YEyRMDgYWwxg0hUcCPD6u/mK0W7BcrVM1T2MHPgWsc4GCBIPIrnqLyXU3E6jaSd/7x3E3XTZ8zVTIkCZAJmPkCeHJZOFyseH23Fo90aRuT7Tp58l0YJRjbZnkt7I6PB+yPX6qeq0nRePxGXG93AfdVKFQNaA4gG8iRzJU1bHU9I8V+8pG07Cqwn5SuWTN0tj0PKiYgiRHL9P0Wm0t8uhlv9Fy+X9pMKBBeR6O+7Vt4bPMK/avT9SAfmQosdF4sB4/Ref8AbQd3VkGLuJi0wGG/Pddbm2LeGTQa2o4mPDDoHONisLNctfiQDUDmOl4lrA4RDQJaXCNua1+PJRnbIyJtbGZ2dwgrPe19y1wAIDRwqTPP2QrGfZGaWlzDuTNoiBN/mr+SYHuaxJf7bgQNLmnc7yIi/NbefMmluDc/NrhzWuVxc9uCYWonL4HN8S8aXhj2zy0mRx8MBXPRPyZs4Z1hwd18TifugR0WuNURN2NKCdCBWtmdDYQIRPogUWOhkIppKSLCjGa8jZSCs7moAU4LKkIlLieKCaiqRIyvXawAuIEkNHmdlWweO116tLhTDfibn6j4LA7dYzQKbf4nH0gD6uVLIM4099XcASY4kXc+/kLz6LOWSnQ6O7FRurRPijVHSYlcn2pqHvi2TENtJvdt+vFWsmzDvsZVc0y0NLQebQQLeZBKrZlimuquIpOc6Yu3aOepXHJ2w02YOZHThT/5Y/8AdWb+q5nGNmnRHMv/AJgF1+IxNSZLIsNnxbh++io4jFi2um83kXabzzgwiWSzSMaLeHw7zii7SdE7wY/umDfzJV7HYEvqkzaYgAk2cT0HzVejiqhcA2m1k2BN3emo39AnYmu4O0vrGZiBI3mLNAHzUqcr+qBxXZp4SiKVMtJDdo1kCYcSZg9dlBTqUWey7p+GyDzjWbx6qDBUmOYXgHhuAD7UHYnks92NMS1rR4Z21H29PvEj5JKOSTYNxSOhoY50AU6ZjgXO6nkrIxOII2YPR3/6SwQGn1d/MVYc7SJ3vHxXO0bJmLisXX1AQ3js3be/iJjz6poqvdAdUEnYF8zNtmpvaQfhu8h/zKayMHUIq0R1b/zCtMWJSVsmc2nSOswmDbpaY3APyVzFYX8IuDSQHMuB/jafsm4Q+Bv8I+iZmOJqMpP0uIBFxuDFxI9Fg1uaLg6bBZE6psB6n9FNV7MVPyA+RH3W7ke1+K2gFFjPP6mQPHuEeX9Fn4s16J/vXsFolzxMzb5L02o0Lz//ALSWHS2PzM+lRaQSb3Jk3RXw2d4sQG1p230O3iDBE8Qr1bPcU1vjDHARwIPTZwWL2Yd+OAf92z5U2P8Asu8zXBsdRcNI4GYHArScEmqFGVp2ZGAzug9rg6WveLiCQCJ2IF/VOcR/W/3WdlGGBD3gS5uqAIE6S0cB1KtjEHZ1Ko30BH1C1hsZy3JkE17wNzHmomV2nZwPkVpZNEpTHBHUmucnYUMhJAvSRY6MJpVrBYV9V2lgkxMW2EDj5hYeVZiXP0PAkzFoA3vfcdVq4l2hhdrLeEtcWm/CQbiYssFK1sTRZx1B1H+8hvC7mztOwPIj4rnc1zxrTDDw363squEpmo5xIDWi5cbmZtvbmoHubUDS0WJi4G0dLJa20VpSZlZ85+IDAGOfUAkwCTp8gNpO6pMwNQhlAgsc+oweIEXJIDuexcuiqZrpxWumQWim2k0kWN5Pnc/JR4zEh73VSQXtgWBEeQ2UN2NKzT7N5K7DPeXVGuAOi2q5cQbSB+X5rJ7Q1Ca1QTYO24ey7+iGEzFwqscTLA4OPURf1AKix2Kovc9+nVqcTdurewHikbGPitsctPKIcbexQzsDuQOfdj4U3uP8qw+6mthxybT/AJi77rexGMEWYI5FrSBFhAiNifirWBy91VzXCiZEERRAtaAD5JvImUolfLo/tR/id8gwKxjaD31nEMcRrZfSYjTcyt1+WVKcF1OoNzeADFyYG6zKlCtZ4pzu72xxtABvaNoQstO0GiyfAUy2gWmxt6S4x9lQGWkiNbfZi2o+9PBq1KYr6Z7pjRYnjax6XWRXzaoZl7QOTWu4jqhZZW2g0LhnS4Tb1PzKeQ2ZnZcnQzu8VHuNxdsDY8tMfNa1DGUnNBGIcOhcW7CSLxxgLndmq2LGY0hVGmHEEQYIBs5p3IMez81HQylrdLhSEtu0ueTEGQfDA3WxgezNau3vKdZ5YSRYxMGPzLMzfKXUXd2+peASHVOZjYTKak0qE0maWFs0Dlb4GFO6pRLSHkEcpF73+65uhhwNIkTFzM81rVcu/wC7d9aHCpA4yzf0WbLTPRcpznDAAGo0G0+Ju/LdbdXMaJALarD4m7Pad3AHY9V51k+TGr7Ongbz06KTFZLBILmggkRPIkfaVD/INno5rsPvC+191jZxlwruDSxrm6dn6wJaTcFhB97nxXEUMG01BTDmkl2njuesRCizjDVKILjwEQHHfUG/dONp7CdNHW0OzzWP1spMD40gh9SANOgWcSPZst3FMmm4cYPqV5dlj8TVvTbV08XNe6G77x5LX7uuRAqvmJjvDc8t1TbBI3sswhpuI8RDg4nU2IO9iCZ36bK9WeIP73XD/wCk8YxxbqcC3cOhxHQyCn1c+xDmFw1QN3aBAvYTEBbRnXJDgT4nNaD6Zl+nz3B8uKx8DjnNd4PEOMW+qzaGaClUa9jAS0k3kjy67q9XzJ+IcahaAdIADBAgOJ+Nz8knJ2NLo6CtjXUwNbSJ2ktE2nmqzsyLrNB24Cfoud7S4mo9zZ1ABoaOsAE/X5p2S4h9NzXXBuP38U3Nj0o1zmdLjWIPkkudxrn94/8AD3cTtzKKLCmLD6WvAa2S0S4vgETAENFp8KuYvEd5+HEgkb8wd1m1cRpD6jQBO9rbkiOl1l0q1R7vDJdHUQeMRcj9VmnaFpOhweBL3Ppio5rZubHbz2ifmoq2EYSAC46SYItPUgLIw/eDUe80lrSTJg7xEOub2jz6q7Ww9Z7abrQRJggESbGCb2jimgaonrZQwiGtIJPrIgwAfMfFHE5W4UnP7moXXmGvNrRtYDdWGZZjqwYKLHvYG6T+JpAipUMFpeNw5pmFYp/9n+OMHuuUy5tz8U/7JsvdlsLR7gPqUmGGAnUwG+na4WZnmGFSn4KbR+I1xDGgaWh4MwBZo2ldA7IcdRoxUpy0AlzgdRgbF3pPwlYFbHCmAPzkMiJ3IS3spUcvn2KqPr903cQ0C1ztz5Ab7LvOzrS3Rq3DRPwErljh6AxGufHv0vafqupy4wfT7KaoaLmcYrXUIOzQGgeoJXG18oc15p6fEBM6ufUWIuugxFcF7ncJJ9FVw+NFZ7r3bDQTaQBYJp0Oi9hnhodI9xwHmWmPmuJxvZ/EaHO8OzSYdyEO/fRdi4hsyRHNVGZk28gx5TI4yqhJrgJJdnOHB0w32G2HIcz05BaGA7N1e6YXaGgtB8ToiQN+qf8A2zCtOqSY2ZLY4236rMzHFV6+qs9pNJu2+ln7jdCTJZ6v2YxVKjh2sfVpSCZIqNi5lc122wdPEVHVGV6HsABpqDU7TJho2JPASuOwZqBo0tdHqPqpazKgGp0EmfeaTvuQDI9VSxsWo3cnwD6r2MbubCdhA3PTitvH4N1BraLiDAcbSR4iSdwosj7U0aDCO4aXhgbr1SNUSSfFESTsLC3RV86z3vna204ERdw69FLg7GmjrOzbgajosCSRwtNrK9nmFLQ+qfZ3IEyLb/vmuN7OdpadPSak+yNr8Oq7/NcWG04LdQfYg3BHGfRZuLZTo5bIcA+vUGIbDWte2zpk6YJiB0+audpMCAZcGlpLjET1vt0WhkuZseQ1jNLPZAHAgmT5fol2izNrBp0g6S0kkSAZERPmlpdi2ooYLAGhRqu8ID2NhrbRYzI53Wfgn+JpW/Uxgq0KloIaZHDbguYwb7t80nzuWuC9n2VOBqVxEO089Vmxfhz+ShGTVP7FWFpe1r2gTPhOqPMgfNb+YYospghmqdxvNrD1TsvxbnsJc2COG3WPMKt6F2cT2Ty+oylWqmNDmuaBxkEXjlC1codFQLVw9QuoVGlobGoAAQIuRZYeXvh7UPka4M/tLktc4iQ7w1nw258NhZ1rf0VjtHRcx1KdxTa0xtLd10uONbw92AfPhz8jCw+1tNxZSeRe4MdQD9iqBHOPqidwkoHls3ASQOjIzHBRTIZrcQQQ2DFllOpVmuDm03lwi2gxxkQZBHmu4TgP3C5VkaNNCOHY/GAOIpubPECDfyIsrmDzZ1MuFQEyZAPAbfZdHWwbnXFV48oWPW7NvLy8ViHHjF/qqWS+SXD0SZb2kqsL4e5jS4FulzmkBsgiWkWJ+i0P9YW1Z72pUI8IE1XNEjVOzXEg6hO3shYv+q1WI70WEbGd559VLh+yZBBNWf8Ah/Uq/LFdi8bZoZl2iYQwNglgAYRJ2LdIdqaNomRxuZJlZz8wY6JkEGdlbPZmkTJe4n0H2Tz2cpn3nfL9EvOh+JlKhXpl2qR5+uy2aGPYB7Y+KqN7OM4PPwCD8kcBDXA+e/0T80H2LxSRI/G0nSNYuquAgOJLhANoIueajGQ1ReR8URlFVu+n4n9FSyw9i8cvRs1MQ3SSSCACTtwC5drdTXd4C8ySNBaCPZsQSP8AFzOytPY0Wc8egJWBm9Mg/huJDo1ATw233TjNdMHB9iNZzHkCmPIuAA5DVN1uYfE1DSqTpbqouJZZwll2mDPAEql2bw1Isf3jg1wAInjcWHlvvw4yqr8SW1fCYAnTbmCOPBaPI3syVFIpuxzyfb+Aj5AJPxTnRNRxgQN7DkL7J9HKKx/2b/8AKVfoZNVG9Fx82/qm869gsX4M+liI4n9+q1MMKxZqa8tbyG3rzUdLIqwcCaTi2dp36EhdBk9N7abmPouJPskEAD+IHfh8OqyeVPsrxsy8Bhqr3DQ0na8jl1K9nw+bU3UmioCDpEt9qCP8XErzrJcH3bQSCHefotttY8yp80eyvFI66lmeHYZawjhZoG5k8eay83z2i52ksMgAgyA7yjisbvv3KjOIb0+X6rN5f+RrD7Zt1M5HdFjKe7SN+JHG265rDV64N6fGd1aGKCYcQFPkl6L0RXZ0Dc/OkDQP+iY/PqnBoH781zr8UeEfH+i5jtzqqU6LC6Jri4t7j1cZPvYI41KSjHdvZHePzOsQRIE7wBx34LPpgtiHG3GAuU7OZLhDrOI1U6YNNjHNAc573kiCXWA2HUnouW7Y0Dh6tSg+locDNN92lzNR0lzeBIG3/VY483kyeNX+v9dXudWbB8fDKWN5Frjdrflcq65/R7Cc2q/7z6KviMzc4QXE/NZTJgeQScCt9L7Zx2vRZOM/cIqgWoJ6EPUSkpByZqRBXKi6JmvUgVcFPBTAlRCjBRn9wkMeEQEhKcigsACIRtzCWpvNFBY4NS0pveNS75vJGlhqQyq1nvaRNrx91FXwYFop/wCUH7qWpUYd2NPmAfqq3cU/y8Z3NvJUoEuYwUGcqP8AlH6oNyrVVFR2gw3TGkEWJIPQ3UopsGzR8J+qcCBtA8hCekWovdxzS0sHvKiShKFBBrZZeRwcPVpP3UDarxMlu9oagiFSghOTAa7uZ9AB9kDVcfzfEqQBFVSFbIrngjpKklKUxEfd9SkKYTy5DUmAtIXOdtcJUqsoUqQJqPxDGsj8xa4C/C/FdDqWdm+Lr0jRq0GuL2VCfC1ri0Gm9pIDgR73zSbkk3Hnq/ZUY6pJXX59C7UUcto16eFxFUBtPDtZVeaVVwdXaZ1eARJFR12zEOBiIOd2hyF2Ly5uKaCauHdVLnOnVVoVq1SrTLpuHN1bH8xus4UcVqe8VcU0vc57gWE+Jzi5xA0wCSSbJzMfj6FOrTw7K7jXbpquqMDtQgjZ4PAkDaJXFH4+WEYaJNyTXPH8uu03769HQ/hz1vJlyQ07vaepyv8ACun3fvk64OsPIfRMc5MDrDyTHFehZzUElFRSknYUicpNSSXGaD04JJI7ESNTikkmAwkpBBJUIBQJSSVIkKKSSYhFNRSQAEkkkAFJFJABCQQSTAScgkmAkkEkANKKSSYDCmlJJAAQKSSBjXpiSSQwIJJIA//Z"
//   },
//   {
//     name: "Dome",
//     image:
//       "data:image/jpeg;base64,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"
//   },
//   {
//     name: "Achimota",
//     image:
//       "data:image/jpeg;base64,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"
//   }
// ];

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  // console.log(req.user)
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/campgrounds", {
        campgrounds: campgrounds
        // currentUser: req.user
      });
    }
  });
});

app.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {
    name: name,
    image: image,
    description: description
  };
  Campground.create(newCampground, function(err, campgrounds) {
    if ((err, campgrounds)) {
      console.log(err);
    } else res.redirect("campgrounds");
  });
  res.redirect("campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        res.render("campgrounds/show", {
          campground: foundCampground
        });
      }
    });
});

app.get("/campgrounds/:id/comments/new", isLogedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        campground: campground
      });
    }
  });
});

app.post("/campgrounds/:id/comments", isLogedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          // console.log(comment)
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  req.body.username;
  req.body.password;
  User.register(
    new User({
      username: req.body.username
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        return res.redirect("register");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/campgrounds");
        });
      }
    }
  );
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    // failureFlash: true
  }),
  (req, res) => {
    res.send("login works");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
app.listen(process.env.PORT || 8080, function() {
  console.log("the yelpcomp server is runing ");
});
