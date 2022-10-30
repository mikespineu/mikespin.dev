varying vec3 v_Normal;

void main(void)
    {
        gl_FragColor = vec4(v_Normal, 1.0);
    }

