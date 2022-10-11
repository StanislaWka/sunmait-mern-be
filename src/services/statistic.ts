import { Post } from '../../models/Posts';
import { User } from '../../models/User';

class StatisticService {
  async getStatistic() {
    try {
      const usersIds = await User.find({}, { name: 1, surname: 1, _id: 1 }).lean();
      const posts = await Post.find({}, { title: 1, user: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .lean();
      const usersWithPosts = usersIds.map((user) => {
        // @ts-ignore
        user.posts = posts.filter((post) => post.user.toString() === user._id.toString());
        return user;
      });
      return usersWithPosts;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default new StatisticService();
