import linkService from "../../services/admin/linkService.js";

const linkController = {
  async handleCreateLink(req, res) {
    try {
      const newLink = await linkService.createLink(req.body);
      res.status(201).json(newLink);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  },

  async handleGetAllLinks(req, res) {
    try {
      const links = await linkService.getAllLinks();
      res.status(200).json(links);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  },

  async handleUpdateLink(req, res) {
    try {
      const { id } = req.params;
      const updatedLink = await linkService.updateLink(id, req.body);
      res.status(200).json(updatedLink);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  },

  async handleDeleteLink(req, res) {
    try {
      const { id } = req.params;
      const result = await linkService.deleteLink(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  },
};

export default linkController;