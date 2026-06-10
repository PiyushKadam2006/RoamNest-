const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("listings/index", { allListing });
};

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);////////////////////////////////////////////////////////////////////////
    res.render("listings/new");
};
module.exports.showLinsting = async (req, res) => {
    let { id } = req.params;
    // const listing = await Listing.findById(id);
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", //nested pupulat for authors name 
            populate: {
                path: "author",
            },
        })
        .populate("owner"); // listings ke andar me owner kar expand karke dega , like looks simple
    if (!listing) {
        /* agar listing exist nahi karti , and deleted lisitng ka libnk past kiya to error new error.ejs pe nahi , lisitng pe error dikhaye  */
        req.flash("error", "Listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...", filename); // ye merese nahi show ho paya 
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);//ye owner related data store karata he 
    /* for the error of 'username'*/
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    /* flash sessions  */
    req.flash("success", "New Listing add");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        req.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit", { listing ,originalImageUrl })
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // if (!currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You don't have permission to edit")
    //     return res.redirect(`/listings/${id}`);
    //     // throw new ExpressError(400, "Invalid listing data");
    // }
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing eddited successfully !!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListings = async (req, res) => {
    const { id } = req.params;
    const idDelete = await Listing.findByIdAndDelete(id);
    console.log(idDelete);
    req.flash("success", "Listing deleted successfully !!!");
    res.redirect("/listings");
};