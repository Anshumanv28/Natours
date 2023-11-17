#include <stdio.h>
#include <netdb.h>

int main() {
    const char *hostname = "www.example.com";
    struct hostent *host;

    // Get host information by name
    host = gethostbyname(hostname);

    if (host == NULL) {
        herror("gethostbyname");
        return 1;
    }

    printf("Official name: %s\n", host->h_name);
    printf("Aliases:\n");
    for (char **alias = host->h_aliases; *alias != NULL; ++alias) {
        printf("  %s\n", *alias);
    }

    printf("IP Addresses:\n");
    for (char **addr = host->h_addr_list; *addr != NULL; ++addr) {
        printf("  %s\n", inet_ntoa(*(struct in_addr *)(*addr)));
    }

    return 0;
}
