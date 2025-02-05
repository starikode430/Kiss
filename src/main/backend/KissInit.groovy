import org.kissweb.database.Connection
import org.kissweb.restServer.MainServlet
import org.kissweb.restServer.UserCache

class KissInit {

    static void init() {
        MainServlet.setConnectionType Connection.ConnectionType.SQLite
        MainServlet.setHost "localhost"
        MainServlet.setDatabase "DB.sqlite"       // the name of the database, leave blank for none (and no authentication)
        MainServlet.setUser ""                    // database user (not application user login)
        MainServlet.setPassword ""                // database password (not application user password)
        MainServlet.setMaxWorkerThreads 30        // max number of simultaneous REST services (any additional are put on a queue)

        UserCache.setInactiveUserMaxSeconds 900   // seconds user is allowed to be idle before auto-logoff

        // Example of how to specify a method that is allowed without authentication
    //    MainServlet.allowWithoutAuthentication("services.MyGroovyService", "addNumbers")

    }
}
