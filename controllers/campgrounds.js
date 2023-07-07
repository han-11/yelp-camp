const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds})
}

module.exports.newCampground = (req,res) =>{
  res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) =>{
  const campground =  new Campground(req.body.campground);
  campground.images = req.files.map( f => ({ url: f.path, filename:f.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground  = async(req, res) =>{
  const { id } = req.params;
  const campground =await Campground.findById(id).populate(
    {path :'reviews',
    populate : {
      path: 'author'
    }}
    ).populate('author');
  if(!campground) {
    req.flash('error', 'Can not find the campground');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/detail', { campground });
}

module.exports.renderEditForm = async (req,res) =>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground) {
    req.flash('error', 'Can not find the campground');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req,res) =>{
  const { id } = req.params;
  const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  const images = req.files.map( f => ({ url: f.path, filename:f.filename }))
  await updatedCampground.images.push(...images);
  await updatedCampground.save();
  if (req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
   await updatedCampground.updateOne({ $pull: {images :{ filename: { $in: req.body.deleteImages }}}})
  }
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${updatedCampground._id}`);
}

module.exports.deleteCampground = async (req, res) =>{
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'You have deleted the campground');
  res.redirect('/campgrounds')
}