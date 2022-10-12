import { Post } from '../../models/Posts';
import { User } from '../../models/User';

class StatisticService {
  async getStatistic() {
    try {
      const usersIds = await User.find({}, { name: 1, surname: 1, _id: 1 }).lean();
      const promises = usersIds.map((user) => {
        return Post.find({ user: user._id }, { title: 1, user: 1, createdAt: 1 })
          .sort({ createdAt: -1 })
          .lean();
      });
      const userPosts = await Promise.all(promises);
      const usersWithPosts = usersIds.map((user, index) => {
        // @ts-ignore
        user.posts = userPosts[index];
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
