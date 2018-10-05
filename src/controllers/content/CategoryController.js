const Controller = require('../Controller');
const Entity = require(`${config.path.model}/Category`);
const {parameters} = require(`${config.path.lib}/pgq`);

module.exports = new class CategoryController extends Controller {

	index(req, res) {

		let {query, options} = parameters(req);

        options['populate'] = 'image';

        Entity.paginate(query, options, (err, entities) => {
			if (err)
				return res.status(404).json('Error');

			if (entities) {
				return res.json(entities);
			}
		});
	}

	get(req, res) {

		Entity.findById(req.params._id).populate('image').exec((err, entity) => {
			if (err)
				return res.status(404).json('Error');

			if (entity) {
				return res.json(entity);
			}
		});
	}

	create(req, res) {

		let {title, text, image} = req.body, user = req.user._id;

		Entity({title, text, image, user}).save((err, entity) => {
			if (err) {
				return res.status(404).json('Error');
			}

			return res.json(entity);
		})
	}

	update(req, res) {

		let {_id, title, text, image} = req.body;

		Entity.findOneAndUpdate({_id}, {title, text, image}, {new: true}, (err, entity) => {

			if (err) {
				return res.status(404).json('Error');
			}

			return res.json(entity);
		});
	}

	delete(req, res) {
		let ids = req.body.ids;

		ids.forEach(id => {Entity.findByIdAndRemove(id, () => {})});

		return res.json('Delete Success');
	}
}