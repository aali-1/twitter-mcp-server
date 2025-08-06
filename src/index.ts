import { TwitterMCPServer } from './server.js';
import logger from './logger.js';
import { serverConfig } from './config.js';

async function main(): Promise<void> {
  try {
    logger.info('Starting Twitter MCP Server', {
      nodeEnv: serverConfig.nodeEnv,
    });

    const mcpServer = new TwitterMCPServer();
    await mcpServer.run();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      process.exit(0);
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection', { reason, promise });
      process.exit(1);
    });

  } catch (error: any) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  logger.error('Application startup failed', { error: error.message, stack: error.stack });
  process.exit(1);
}); 