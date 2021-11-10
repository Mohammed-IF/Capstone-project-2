
exports.getCustomServices = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
  
    CustomService.find()
      .countDocuments()
      .then(numCustomServices => {
        totalItems = numCustomServices;
  
        return CustomService.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then(customServices => {
        res.render('freelancerPages/customService-list', {
          prods: customServices,
          pageTitle: 'All CustomServices',
          path: '/freelancerPages/customServices',
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
      })
      .catch(err => console.log(err));
  };
  
  exports.getCustomService = (req, res, next) => {
    const prodId = req.params.customServiceId;
    CustomService.findById(prodId).then(customService => {
      res.render('freelancerPages/customService-detail', {
        customService: customService,
        pageTitle: customService.title,
        path: '/freelancerPages/customServices-detail'
      });
    });
  };