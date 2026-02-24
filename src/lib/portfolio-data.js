/**
 * CEO Upwork portfolio – run src/scrapping/scrap.py to refresh.
 * Data is written to src/data/portfolio.json by the script.
 */
import portfolioData from '@/data/portfolio.json';

export const portfolio = portfolioData.projects || [];
export const portfolioMeta = {
  source: portfolioData.source,
  profileUrl: portfolioData.profileUrl,
  fetchedAt: portfolioData.fetchedAt,
  totalProjects: portfolioData.totalProjects ?? portfolio.length,
};

export default portfolioData;
