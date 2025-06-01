package org.example.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.example.config.JwtTokenProvider;
import java.io.IOException;
import org.springframework.security.core.Authentication;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
                System.out.println("Requested path: " + request.getRequestURI());//debug statement for profiles page
                

                //skips jwt filter for public routes
        String path = request.getRequestURI();
        if (path.startsWith("/auth/login") || path.startsWith("/api/users")) {
            System.out.println(" Skipping JWT filter for: " + path);
            System.out.println("JWT Filter triggered for path: " + path);

            filterChain.doFilter(request, response);
            return;
        }

        String token = tokenProvider.resolveToken(request);

        System.out.println("Jwt Filter Triggered - Token: " + token);// helps isolate where the problem is in terminal

        if (token != null && tokenProvider.validateToken(token)) {
            Authentication authentication = tokenProvider.getAuthentication(token);
            if (authentication instanceof UsernamePasswordAuthenticationToken authToken) {
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                System.out.println("DEBUG: Token received = " + token);
                System.out.println("DEBUG: Authentication = " + authentication);
                System.out.println("DEBUG: Authorities = " + authentication.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authToken);

            }
        }

        filterChain.doFilter(request, response);
    }
}
